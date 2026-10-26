import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, isMockStripeMode } from "@/lib/stripe";
import { logAudit } from "@/lib/auth";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event: Stripe.Event | { type: string; data: { object: Record<string, unknown> } };

    // 1. Signature verification
    if (!isMockStripeMode() && stripe && webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: "Отсутствует подпись stripe-signature." }, { status: 400 });
      }
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Неверная подпись";
        console.error("Stripe webhook signature verification failed:", message);
        return NextResponse.json({ error: `Ошибка валидации подписи: ${message}` }, { status: 400 });
      }
    } else {
      // In Mock / Simulator Mode, parse incoming JSON directly
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Некорректный JSON в теле запроса." }, { status: 400 });
      }
    }

    const eventType = event.type;
    const sessionObj = event.data.object as Record<string, unknown>;

    // 2. Handle Checkout Session Completed or Payment Intent Succeeded
    if (eventType === "checkout.session.completed" || eventType === "payment_intent.succeeded") {
      const orderId =
        (sessionObj.client_reference_id as string) ||
        ((sessionObj.metadata as Record<string, string>)?.orderId as string);

      const providerPaymentId = (sessionObj.id as string) || (sessionObj.payment_intent as string);

      if (!orderId) {
        console.warn("Stripe webhook: missing orderId in session payload", sessionObj.id);
        return NextResponse.json({ received: true, warning: "Missing orderId" }, { status: 200 });
      }

      // Fetch order from DB
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        console.warn(`Stripe webhook: Order with ID ${orderId} not found`);
        return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
      }

      // Idempotency check: don't process if already paid
      if (order.paymentStatus === "paid") {
        console.log(`[STRIPE_IDEMPOTENCY] Order ${order.orderNumber} already marked as paid. Ignoring duplicate webhook.`);
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
      }

      // Update Order and Payment within a transaction
      await prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "paid",
            status: order.status === "pending" ? "processing" : order.status,
          },
        });

        // Upsert/Update Payment
        if (providerPaymentId) {
          const existingPayment = await tx.payment.findFirst({
            where: {
              OR: [
                { providerPaymentId },
                { idempotencyKey: providerPaymentId },
                { orderId: order.id },
              ],
            },
          });

          if (existingPayment) {
            await tx.payment.update({
              where: { id: existingPayment.id },
              data: {
                status: "paid",
                providerPaymentId,
              },
            });
          } else {
            await tx.payment.create({
              data: {
                orderId: order.id,
                provider: "STRIPE",
                providerPaymentId,
                amount: order.total,
                currency: "UZS",
                status: "paid",
                idempotencyKey: providerPaymentId,
              },
            });
          }
        }
      });

      // Write Audit Log
      await logAudit(
        "STRIPE_WEBHOOK",
        "CONFIRM_PAYMENT",
        "Order",
        order.id,
        {
          orderNumber: order.orderNumber,
          amount: order.total,
          providerPaymentId,
          eventType,
        }
      );

      console.log(`✅ [STRIPE] Payment confirmed successfully for Order: ${order.orderNumber}`);
      return NextResponse.json({ received: true, success: true }, { status: 200 });
    }

    // 3. Handle Payment Failed
    if (eventType === "payment_intent.payment_failed") {
      const orderId = ((sessionObj.metadata as Record<string, string>)?.orderId as string) || (sessionObj.client_reference_id as string);
      const providerPaymentId = sessionObj.id as string;

      if (orderId) {
        await prisma.order.updateMany({
          where: { id: orderId, paymentStatus: { not: "paid" } },
          data: { paymentStatus: "failed" },
        });

        if (providerPaymentId) {
          await prisma.payment.updateMany({
            where: { providerPaymentId },
            data: { status: "failed" },
          });
        }

        await logAudit(
          "STRIPE_WEBHOOK",
          "PAYMENT_FAILED",
          "Order",
          orderId,
          { providerPaymentId, eventType }
        );
      }

      return NextResponse.json({ received: true, status: "payment_failed_recorded" }, { status: 200 });
    }

    // Acknowledge other event types
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe Webhook Processing Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка обработки вебхука Stripe" },
      { status: 500 }
    );
  }
}

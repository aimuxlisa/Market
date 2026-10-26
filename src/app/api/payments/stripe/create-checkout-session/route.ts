import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeEnabled, isMockStripeMode, formatAmountForStripe } from "@/lib/stripe";
import { logAudit } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getAppOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim() !== "") {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || new URL(req.url).host;
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!isStripeEnabled()) {
      return NextResponse.json(
        { error: "Онлайн-оплата картой через Stripe в данный момент отключена." },
        { status: 400 }
      );
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Параметр orderId обязателен." }, { status: 400 });
    }

    // 1. Fetch order from DB strictly to avoid trusting client prices
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Заказ не найден." }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Данный заказ уже успешно оплачен." }, { status: 400 });
    }

    const origin = getAppOrigin(req);
    const currency = (process.env.STRIPE_CURRENCY || "uzs").toLowerCase();
    const successUrl = `${origin}/order/success/${order.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/order/success/${order.id}?payment=cancelled`;

    let checkoutUrl = "";
    let providerPaymentId = "";

    // 2. Real Stripe Mode vs Mock/Dev Simulator Mode
    if (!isMockStripeMode() && stripe) {
      // Real Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `Заказ ${order.orderNumber} в Nexora Store`,
                description: `Оплата заказа ${order.orderNumber}`,
              },
              unit_amount: formatAmountForStripe(order.total, currency),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: order.customerEmail || order.user?.email || undefined,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      checkoutUrl = session.url || "";
      providerPaymentId = session.id;
    } else {
      // Test / Developer Simulator Mode
      providerPaymentId = `cs_test_${order.id}_${Date.now()}`;
      checkoutUrl = `${origin}/order/stripe-simulator?orderId=${order.id}&sessionId=${providerPaymentId}&amount=${order.total}&currency=${currency}`;
    }

    // 3. Upsert Payment record in database
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "STRIPE",
        providerPaymentId,
        amount: order.total,
        currency: currency.toUpperCase(),
        status: "pending",
        idempotencyKey: providerPaymentId,
        metadata: JSON.stringify({
          orderNumber: order.orderNumber,
          mode: isMockStripeMode() ? "test_simulator" : "stripe_live_or_test",
        }),
      },
    });

    // 4. Log Audit
    await logAudit(
      order.customerEmail || "customer",
      "INITIATE_STRIPE_PAYMENT",
      "Payment",
      order.id,
      {
        orderNumber: order.orderNumber,
        amount: order.total,
        providerPaymentId,
      }
    );

    return NextResponse.json({
      success: true,
      url: checkoutUrl,
      sessionId: providerPaymentId,
      amount: order.total,
      currency: currency.toUpperCase(),
    });
  } catch (error) {
    console.error("Create Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Не удалось сформировать сессию оплаты. Попробуйте снова." },
      { status: 500 }
    );
  }
}

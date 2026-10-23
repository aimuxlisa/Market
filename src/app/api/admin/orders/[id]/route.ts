import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAudit } from "@/lib/auth";

const ALLOWED_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const ALLOWED_PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
      payments: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { status, paymentStatus, adminComment } = await req.json();

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    if (status && !ALLOWED_ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Недопустимый статус заказа" }, { status: 400 });
    }

    if (paymentStatus && !ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json({ error: "Недопустимый статус оплаты" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    await logAudit(admin.email, "UPDATE_ORDER_STATUS", "Order", id, {
      orderNumber: updated.orderNumber,
      oldStatus: existing.status,
      newStatus: updated.status,
      oldPaymentStatus: existing.paymentStatus,
      newPaymentStatus: updated.paymentStatus,
      adminComment,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Не удалось обновить статус заказа" }, { status: 500 });
  }
}

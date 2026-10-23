import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/format";
import { ArrowLeft, Clock, MapPin, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const [user, order] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
    }),
    prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    }),
  ]);

  if (!user) {
    redirect("/auth/login");
  }

  // Security check per SPEC: user can only view their own order (unless admin)
  if (!order || (order.userId !== session.id && session.role !== "ADMIN")) {
    notFound();
  }

  const statusInfo = ORDER_STATUS_LABELS[order.status] || { label: order.status, color: "cyan" as const };
  const paymentStatusInfo = PAYMENT_STATUS_LABELS[order.paymentStatus] || { label: order.paymentStatus, color: "purple" as const };

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "2rem 0 5rem" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <AccountSidebar user={user} />

            <div style={{ flex: 1, minWidth: "300px" }}>
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2.5rem 2rem",
                }}
              >
                {/* Back button and title */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <Link href="/account/orders" style={{ color: "var(--accent-cyan)", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <ArrowLeft size={16} /> Назад к списку заказов
                  </Link>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Badge variant={statusInfo.color}>{statusInfo.label}</Badge>
                    <Badge variant={paymentStatusInfo.color}>{paymentStatusInfo.label}</Badge>
                  </div>
                </div>

                <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                  <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFF", marginBottom: "0.25rem" }}>
                    Заказ {order.orderNumber}
                  </h1>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Clock size={13} /> Создан {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Info grids */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
                  <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>
                      <MapPin size={18} />
                      <strong style={{ fontSize: "0.875rem" }}>Адрес доставки</strong>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#FFF" }}>{order.deliveryCity}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{order.deliveryAddress}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                      Способ: {order.deliveryMethod === "express" ? "Экспресс" : order.deliveryMethod === "pickup" ? "Самовывоз" : "Стандартная доставка"}
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-success)", marginBottom: "0.5rem" }}>
                      <CreditCard size={18} />
                      <strong style={{ fontSize: "0.875rem" }}>Оплата</strong>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#FFF" }}>
                      {order.paymentMethod === "cash" ? "Наличными курьеру" : order.paymentMethod === "card_on_delivery" ? "Картой курьеру" : "Онлайн (Payme)"}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      Статус оплаты: {paymentStatusInfo.label}
                    </div>
                  </div>
                </div>

                {/* Items snapshot table */}
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFF", marginBottom: "1rem" }}>
                  Содержимое заказа
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "#FFF" }}>{item.productNameSnapshot}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Артикул: {item.skuSnapshot} · {item.quantity} шт. × {formatPrice(item.unitPrice)}
                        </div>
                      </div>
                      <span className="font-display" style={{ fontWeight: 800, color: "var(--accent-cyan)", fontSize: "1rem" }}>
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div style={{ background: "var(--bg-surface)", padding: "1.5rem", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Стоимость товаров:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Стоимость доставки:</span>
                    <span>{order.deliveryFee === 0 ? "Бесплатно" : formatPrice(order.deliveryFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-success)" }}>
                      <span>Скидка:</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 800, color: "#FFF", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                    <span>Итого к оплате:</span>
                    <span style={{ color: "var(--accent-cyan)" }}>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

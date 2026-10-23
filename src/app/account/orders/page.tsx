import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/format";
import { Package, Clock, ArrowRight, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersHistoryPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/auth/login");
  }

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
    }),
    prisma.order.findMany({
      where: { userId: session.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/auth/login");
  }

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
                <div style={{ marginBottom: "2rem" }}>
                  <h1 className="font-display" style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFF", marginBottom: "0.5rem" }}>
                    История заказов
                  </h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Все ваши покупки, статусы отправки и история чеков
                  </p>
                </div>

                {orders.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {orders.map((ord) => {
                      const st = ORDER_STATUS_LABELS[ord.status] || { label: ord.status, color: "cyan" as const };
                      const paySt = PAYMENT_STATUS_LABELS[ord.paymentStatus] || { label: ord.paymentStatus, color: "purple" as const };
                      return (
                        <div
                          key={ord.id}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-lg)",
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          {/* Order top bar */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "1rem" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                                <span className="font-display" style={{ fontWeight: 800, fontSize: "1.125rem", color: "#FFF" }}>
                                  {ord.orderNumber}
                                </span>
                                <Badge variant={st.color}>{st.label}</Badge>
                                <Badge variant={paySt.color}>{paySt.label}</Badge>
                              </div>
                              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                <Clock size={13} /> Оформлен: {formatDate(ord.createdAt)}
                              </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Итого:</span>
                              <span className="font-display" style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                                {formatPrice(ord.total)}
                              </span>
                            </div>
                          </div>

                          {/* Order items preview */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {ord.items.map((item) => (
                              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                                <span style={{ color: "#FFF" }}>
                                  {item.productNameSnapshot} <span style={{ color: "var(--text-muted)" }}>× {item.quantity}</span>
                                </span>
                                <span>{formatPrice(item.lineTotal)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Footer action */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <Truck size={14} /> Доставка: {ord.deliveryCity}, {ord.deliveryAddress}
                            </div>
                            <Link href={`/account/orders/${ord.id}`}>
                              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Подробнее о заказе
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Package size={36} />}
                    title="Заказов пока нет"
                    description="Вы ещё не оформили ни одного заказа. Все ваши покупки будут отображаться здесь со статусами и деталями доставки."
                    actionText="Перейти в каталог"
                    actionHref="/catalog"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

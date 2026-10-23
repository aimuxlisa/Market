import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import { Package, MapPin, ShieldCheck, ArrowRight, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/auth/login");
  }

  // Fetch user stats and recent orders
  const [user, orders, addressesCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
    }),
    prisma.order.findMany({
      where: { userId: session.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.address.count({
      where: { userId: session.id },
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
            
            {/* Sidebar */}
            <AccountSidebar user={user} />

            {/* Dashboard Content */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              
              {/* Welcome Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(16, 24, 46, 0.8) 0%, rgba(22, 33, 62, 0.6) 100%)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                  marginBottom: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  boxShadow: "0 0 25px rgba(0, 229, 255, 0.08)",
                }}
              >
                <div>
                  <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFF", marginBottom: "0.4rem" }}>
                    Здравствуйте, {user.name}!
                  </h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    Добро пожаловать в персональный кабинет Nexora Store
                  </p>
                </div>

                <Link href="/catalog">
                  <Button variant="cyan" size="md" rightIcon={<ArrowRight size={16} />}>
                    Перейти к покупкам
                  </Button>
                </Link>
              </div>

              {/* Quick Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.25rem",
                  marginBottom: "2.5rem",
                }}
              >
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
                      <Package size={18} />
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Всего заказов</span>
                  </div>
                  <div className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFF" }}>
                    {orders.length}
                  </div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(138, 43, 226, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-violet)" }}>
                      <MapPin size={18} />
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Сохраненные адреса</span>
                  </div>
                  <div className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFF" }}>
                    {addressesCount}
                  </div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)" }}>
                      <ShieldCheck size={18} />
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Статус профиля</span>
                  </div>
                  <div className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-success)" }}>
                    Верифицирован
                  </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF" }}>
                    Последние заказы
                  </h3>
                  <Link href="/account/orders" style={{ color: "var(--accent-cyan)", fontSize: "0.875rem", fontWeight: 600 }}>
                    Все заказы ({orders.length}) →
                  </Link>
                </div>

                {orders.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {orders.map((ord) => {
                      const st = ORDER_STATUS_LABELS[ord.status] || { label: ord.status, color: "cyan" as const };
                      return (
                        <div
                          key={ord.id}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-lg)",
                            padding: "1.25rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                              <span className="font-display" style={{ fontWeight: 800, color: "#FFF", fontSize: "1rem" }}>
                                {ord.orderNumber}
                              </span>
                              <Badge variant={st.color}>{st.label}</Badge>
                            </div>
                            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <Clock size={13} /> {formatDate(ord.createdAt)} · {ord.items.length} поз.
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <span className="font-display" style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--accent-cyan)" }}>
                              {formatPrice(ord.total)}
                            </span>
                            <Link href={`/account/orders/${ord.id}`}>
                              <Button variant="secondary" size="sm">
                                Детали
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                    У вас пока нет оформленных заказов.
                  </div>
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

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/auth/login?returnUrl=/admin");
  }

  const [
    productsCount,
    categoriesCount,
    ordersCount,
    recentOrders,
    recentAudit,
    totalSales,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 5,
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } },
    }),
  ]);

  const stats = [
    { label: "Выручка (активные)", value: formatPrice(totalSales._sum.total || 0), icon: TrendingUp, color: "var(--color-success)" },
    { label: "Заказов всего", value: ordersCount.toString(), icon: ShoppingBag, color: "var(--accent-coral)" },
    { label: "Товаров в каталоге", value: productsCount.toString(), icon: Package, color: "var(--accent-cyan)" },
    { label: "Категорий", value: categoriesCount.toString(), icon: Layers, color: "var(--accent-violet)" },
  ];

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "2.5rem 0 5rem" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <AdminSidebar adminEmail={admin.email} adminName={admin.name} />

            <div style={{ flex: 1, minWidth: "320px", display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Header card */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-xl)",
                  padding: "1.75rem 2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFF", letterSpacing: "-0.02em" }}>
                    Панель администратора
                  </h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    Управление товарами, категориями, заказами и аудит действий в магазине
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <Link
                    href="/admin/products"
                    className="btn btn-cyan btn-sm"
                  >
                    + Добавить товар
                  </Link>
                  <Link
                    href="/admin/categories"
                    className="btn btn-secondary btn-sm"
                  >
                    + Категория
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {stats.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "var(--radius-lg)",
                        padding: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "12px",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: s.color,
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{s.label}</div>
                        <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFF", marginTop: "0.2rem" }}>
                          {s.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders & Recent Audit */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
                {/* Recent Orders */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF" }}>Последние заказы</h3>
                    <Link href="/admin/orders" style={{ fontSize: "0.8125rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      Все заказы <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {recentOrders.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Заказов пока нет</p>
                    ) : (
                      recentOrders.map((ord) => (
                        <div
                          key={ord.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.75rem 1rem",
                            background: "var(--bg-surface)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#FFF" }}>
                              {ord.orderNumber}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {ord.customerName} · {formatDate(ord.createdAt)}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--accent-cyan)" }}>
                              {formatPrice(ord.total)}
                            </div>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit Log Snippet */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF" }}>Журнал действий</h3>
                    <Link href="/admin/audit" style={{ fontSize: "0.8125rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      Полный журнал <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {recentAudit.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Записей аудита пока нет</p>
                    ) : (
                      recentAudit.map((log) => (
                        <div
                          key={log.id}
                          style={{
                            padding: "0.75rem 1rem",
                            background: "var(--bg-surface)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "0.8125rem",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                            <span style={{ fontWeight: 700, color: "var(--accent-coral)" }}>{log.action}</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{formatDate(log.timestamp)}</span>
                          </div>
                          <div style={{ color: "var(--text-secondary)" }}>
                            {log.entity} {log.entityId ? `(#${log.entityId.slice(-6)})` : ""} · {log.actor}
                          </div>
                        </div>
                      ))
                    )}
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

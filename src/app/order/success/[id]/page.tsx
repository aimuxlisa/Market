import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import { CheckCircle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusInfo = ORDER_STATUS_LABELS[order.status] || { label: order.status, color: "cyan" as const };

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "3rem 0 5rem" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          
          {/* Success Banner Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem 2rem",
              textAlign: "center",
              marginBottom: "2rem",
              boxShadow: "0 0 35px rgba(0, 229, 255, 0.1)",
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--color-success)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <CheckCircle size={36} />
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "0.5rem",
              }}
            >
              Спасибо за покупку!
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "520px", margin: "0 auto 1.5rem" }}>
              Ваш заказ успешно принят и передан в отдел доставки. Мы уже готовим посылку к отправке.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                background: "var(--bg-surface)",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Номер заказа</span>
                <span className="font-display" style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                  {order.orderNumber}
                </span>
              </div>
              <div style={{ height: "28px", width: "1px", background: "var(--border-subtle)" }} />
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Статус</span>
                <Badge variant={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFF", marginBottom: "1.25rem" }}>
              Детали доставки и получателя
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "block" }}>Получатель</span>
                <strong style={{ color: "#FFF", fontSize: "0.9375rem" }}>{order.customerName}</strong>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{order.customerPhone}</div>
              </div>

              <div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "block" }}>Адрес доставки</span>
                <strong style={{ color: "#FFF", fontSize: "0.9375rem" }}>{order.deliveryCity}</strong>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{order.deliveryAddress}</div>
              </div>

              <div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "block" }}>Способ оплаты</span>
                <strong style={{ color: "#FFF", fontSize: "0.9375rem" }}>
                  {order.paymentMethod === "cash" ? "Наличными курьеру" : order.paymentMethod === "card_on_delivery" ? "Картой курьеру" : "Онлайн (Payme)"}
                </strong>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                  Дата: {formatDate(order.createdAt)}
                </div>
              </div>
            </div>

            {/* Items Snapshot Table */}
            <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#FFF", marginBottom: "0.75rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
              Состав заказа:
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid var(--border-subtle)",
                    fontSize: "0.875rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "#FFF" }}>{item.productNameSnapshot}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Арт: {item.skuSnapshot} · {item.quantity} шт. × {formatPrice(item.unitPrice)}
                    </div>
                  </div>
                  <strong style={{ color: "var(--accent-cyan)" }}>
                    {formatPrice(item.lineTotal)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Товары:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Доставка:</span>
                <span>{order.deliveryFee === 0 ? "Бесплатно" : formatPrice(order.deliveryFee)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, color: "#FFF", borderTop: "1px solid var(--border-card)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                <span>Итоговая сумма:</span>
                <span style={{ color: "var(--accent-cyan)" }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalog">
              <Button variant="secondary" size="md">
                Вернуться в каталог
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="cyan" size="md" rightIcon={<ArrowRight size={16} />}>
                Мои заказы в кабинете
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

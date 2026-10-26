"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import { CreditCard, ShieldCheck, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

function StripeSimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";
  const sessionId = searchParams.get("sessionId") || "";
  const rawAmount = searchParams.get("amount") || "0";
  const currency = searchParams.get("currency") || "UZS";

  const amount = parseInt(rawAmount, 10) || 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimulatePayment = async (status: "success" | "failed") => {
    try {
      setLoading(true);
      setError("");

      const eventPayload =
        status === "success"
          ? {
              type: "checkout.session.completed",
              data: {
                object: {
                  id: sessionId,
                  client_reference_id: orderId,
                  amount_total: amount * 100,
                  currency: currency.toLowerCase(),
                  payment_status: "paid",
                  metadata: {
                    orderId,
                  },
                },
              },
            }
          : {
              type: "payment_intent.payment_failed",
              data: {
                object: {
                  id: sessionId,
                  client_reference_id: orderId,
                  metadata: {
                    orderId,
                  },
                },
              },
            };

      // Call the real webhook endpoint!
      const res = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка отправки тестового вебхука");
      }

      // Redirect to order success page
      router.push(`/order/success/${orderId}?payment=${status}`);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Произошла ошибка при симуляции");
      setLoading(false);
    }
  };

  return (
    <main className="main-content" style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        
        {/* Navigation back */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href={`/order/success/${orderId}`}
            style={{
              color: "var(--accent-cyan)",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ArrowLeft size={16} /> Назад к деталям заказа
          </Link>
        </div>

        {/* Card Frame */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem 2rem",
            boxShadow: "0 10px 40px rgba(99, 91, 255, 0.15)",
          }}
        >
          {/* Header Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  background: "#635BFF",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                stripe
              </div>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Тестовый режим (Sandbox)</span>
            </div>
            <Badge variant="purple">TEST MODE</Badge>
          </div>

          <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.5rem" }}>
            Тестовая оплата заказа
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Имитация безопасного защищенного шлюза Stripe Checkout для проверки Этапа 7.
          </p>

          {/* Amount Box */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Сумма к оплате</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                {formatPrice(amount)}
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              Валюта: <strong>{currency}</strong>
            </div>
          </div>

          {/* Mock Card Preview */}
          <div
            style={{
              background: "linear-gradient(135deg, #1f1b3c 0%, #111026 100%)",
              border: "1px solid rgba(99, 91, 255, 0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <CreditCard size={28} color="#635BFF" />
              <span style={{ fontSize: "0.75rem", color: "#635BFF", fontWeight: 700 }}>STRIPE TEST CARD</span>
            </div>
            <div style={{ fontSize: "1.25rem", fontFamily: "monospace", letterSpacing: "0.15em", color: "#FFF", marginBottom: "1rem" }}>
              4242 •••• •••• 4242
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>Срок: 12/28</span>
              <span>CVC: 123</span>
              <span>Имя: TEST USER</span>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid var(--color-error)",
                color: "#FCA5A5",
                padding: "0.875rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Button
              variant="cyan"
              size="lg"
              disabled={loading}
              isLoading={loading}
              onClick={() => handleSimulatePayment("success")}
              style={{ width: "100%", background: "#635BFF", borderColor: "#635BFF" }}
            >
              <CheckCircle size={18} /> Оплатить успешно ({formatPrice(amount)})
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={loading}
              onClick={() => handleSimulatePayment("failed")}
              style={{ width: "100%", color: "#EF4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              Симулировать отказ (Payment Failed)
            </Button>
          </div>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            <ShieldCheck size={14} color="#10B981" />
            Безопасное 256-битное шифрование через тестовый протокол Stripe
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StripeSimulatorPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container" style={{ padding: "4rem 0", color: "#FFF" }}>Загрузка шлюза оплаты...</div>}>
        <StripeSimulatorContent />
      </Suspense>
      <Footer />
    </>
  );
}

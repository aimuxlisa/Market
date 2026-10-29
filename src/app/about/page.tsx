import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, ShieldCheck, Award, Zap, Truck, CreditCard, Sparkles } from "lucide-react";

export const metadata = {
  title: "О компании Haven Electronics | Премиальная техника в Узбекистане",
  description: "Официальный магазин флагманской электроники в Ташкенте. Гарантия качества, прямые поставки и сервис высшего класса.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="main-content" style={{ padding: "5rem 0 7rem" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          
          {/* Hero Header */}
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.22em",
                color: "#C29B63",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              О КОМПАНИИ HAVEN ELECTRONICS
            </span>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                lineHeight: 1.15,
                color: "#FFFFFF",
                fontWeight: 400,
                marginBottom: "1.5rem",
              }}
            >
              Инновационные технологии<br />для вашей идеальной жизни.
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#94A3B8",
                maxWidth: "680px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Haven Electronics — ведущий онлайн-ритейлер премиальной электроники в Узбекистане. Мы предлагаем оригинальные флагманы Apple, Samsung, Sony, Dyson с официальной гарантией и прозрачными ценами в сумах.
            </p>
          </div>

          {/* Large Showcase Banner */}
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              aspectRatio: "21 / 9",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "5rem",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=85&fit=crop"
              alt="Haven Electronics Showcase"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
              marginBottom: "5rem",
            }}
          >
            <div
              style={{
                background: "rgba(13, 19, 31, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              <Award size={28} color="#C29B63" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
                100% Оригинал
              </h3>
              <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Только подлинная сертифицированная техника с официальными серийными номерами и заводской гарантией.
              </p>
            </div>

            <div
              style={{
                background: "rgba(13, 19, 31, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              <ShieldCheck size={28} color="#C29B63" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
                Гарантия до 24 месяцев
              </h3>
              <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Авторизованный сервисный центр и оперативное обслуживание без очередей и задержек.
              </p>
            </div>

            <div
              style={{
                background: "rgba(13, 19, 31, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              <Truck size={28} color="#C29B63" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
                Быстрая доставка
              </h3>
              <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Экспресс-доставка по Ташкенту от 2 часов в день заказа и доставка в любой регион Узбекистана.
              </p>
            </div>

            <div
              style={{
                background: "rgba(13, 19, 31, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              <CreditCard size={28} color="#C29B63" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
                Цены в сумах и рассрочка
              </h3>
              <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Оплата Uzcard, Humo, Visa, а также честная рассрочка без скрытых страховок и переплат.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div
            style={{
              background: "rgba(194, 155, 99, 0.08)",
              border: "1px solid rgba(194, 155, 99, 0.3)",
              borderRadius: "24px",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "#FFFFFF", marginBottom: "0.75rem" }}>
              Готовы выбрать новый флагман?
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.9375rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
              Ознакомьтесь с полным ассортиментом оригинальной техники в нашем каталоге с актуальными ценами в сумах.
            </p>
            <Link href="/catalog">
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  background: "#C29B63",
                  color: "#06080D",
                  padding: "0.85rem 2rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>Перейти в каталог техники</span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, BookOpen, Smartphone, Laptop, Sparkles } from "lucide-react";

export const metadata = {
  title: "Блог и обзоры техники | Haven Electronics",
  description: "Экспертные обзоры флагманов, сравнения iPhone 16 Pro и Galaxy S25, гайды по выбору техники в Узбекистане.",
};

export default function ResourcesPage() {
  const articles = [
    {
      title: "Apple M4 Pro против M4 Max: какой MacBook выбрать для профессионального продакшена в 2026 году?",
      category: "Обзор ноутбуков",
      date: "Октябрь 2026",
      readTime: "6 мин чтения",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=85&fit=crop",
    },
    {
      title: "iPhone 16 Pro Max против Galaxy S25 Ultra: сравнительный тест камер и ночной съемки",
      category: "Битва флагманов",
      date: "Сентябрь 2026",
      readTime: "8 мин чтения",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=85&fit=crop",
    },
    {
      title: "PlayStation 5 Pro в Ташкенте: стоит ли переходить ради 4K 120 FPS и трассировки лучей?",
      category: "Гейминг",
      date: "Август 2026",
      readTime: "5 мин чтения",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=85&fit=crop",
    },
  ];

  return (
    <>
      <Header />
      <main className="main-content" style={{ padding: "5rem 0 7rem" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
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
              HAVEN TECH JOURNAL
            </span>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 4.5vw, 3.85rem)",
                lineHeight: 1.15,
                color: "#FFFFFF",
                fontWeight: 400,
                marginBottom: "1.25rem",
              }}
            >
              Экспертные обзоры & Гиды покупателя
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#94A3B8",
                maxWidth: "640px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Подробные тесты флагманских гаджетов, сравнения производительности и рекомендации наших экспертов.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {articles.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(13, 19, 31, 0.72)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                className="property-card-hover"
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    className="property-card-img"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: "rgba(14, 20, 32, 0.8)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#C29B63",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "9999px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.category}
                  </div>
                </div>

                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8E9BAE", marginBottom: "0.5rem" }}>
                    {item.date} · {item.readTime}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.25rem",
                      color: "#FFFFFF",
                      fontWeight: 500,
                      lineHeight: 1.35,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <div style={{ marginTop: "auto" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        color: "#DFC5A0",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      <span>Читать статью</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

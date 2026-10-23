import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones, CreditCard, Banknote } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: "5rem",
        background: "linear-gradient(180deg, rgba(8, 6, 22, 0.65) 0%, rgba(4, 3, 10, 0.88) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border-card)",
        paddingTop: "3.5rem",
        paddingBottom: "2.5rem",
      }}
    >
      {/* Advantage Features row */}
      <div className="container" style={{ marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            background: "var(--bg-card)",
            padding: "2rem",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(0, 229, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-cyan)",
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Быстрая доставка</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                По Ташкенту от 2 часов и по всему Узбекистану
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(138, 43, 226, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-violet)",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>100% Оригинал</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                Официальная гарантия до 24 месяцев
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(255, 77, 77, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-coral)",
              }}
            >
              <RotateCcw size={24} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Простой возврат</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                14 дней на обмен или возврат покупки
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-success)",
              }}
            >
              <Headphones size={24} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Служба заботы</h5>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                Ежедневно с 09:00 до 22:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand info */}
          <div style={{ maxWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: "#FFF",
                }}
              >
                N
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFF" }}>
                NEXORA<span style={{ color: "var(--accent-cyan)" }}>.</span>
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Премиальный интернет-магазин оригинальной электроники, гаджетов и инновационной техники для дома в Узбекистане.
            </p>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
              г. Ташкент, проспект Амира Темура, 45
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 style={{ color: "#FFF", fontSize: "0.9375rem", fontWeight: 700, marginBottom: "1rem" }}>
              Каталог товаров
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
              <li>
                <Link href="/catalog/smartphones" style={{ color: "var(--text-secondary)" }}>
                  Смартфоны и гаджеты
                </Link>
              </li>
              <li>
                <Link href="/catalog/laptops" style={{ color: "var(--text-secondary)" }}>
                  Ноутбуки и MacBook
                </Link>
              </li>
              <li>
                <Link href="/catalog/tv-audio" style={{ color: "var(--text-secondary)" }}>
                  Телевизоры и акустика
                </Link>
              </li>
              <li>
                <Link href="/catalog/appliances" style={{ color: "var(--text-secondary)" }}>
                  Бытовая техника Dyson
                </Link>
              </li>
              <li>
                <Link href="/catalog/gaming" style={{ color: "var(--text-secondary)" }}>
                  PlayStation 5 и гейминг
                </Link>
              </li>
            </ul>
          </div>

          {/* Customers */}
          <div>
            <h4 style={{ color: "#FFF", fontSize: "0.9375rem", fontWeight: 700, marginBottom: "1rem" }}>
              Покупателям
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
              <li>
                <Link href="/catalog" style={{ color: "var(--text-secondary)" }}>
                  Все товары магазина
                </Link>
              </li>
              <li>
                <Link href="/account" style={{ color: "var(--text-secondary)" }}>
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link href="/cart" style={{ color: "var(--text-secondary)" }}>
                  Корзина покупок
                </Link>
              </li>
              <li>
                <Link href="/favorites" style={{ color: "var(--text-secondary)" }}>
                  Список избранного
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Payment methods */}
          <div>
            <h4 style={{ color: "#FFF", fontSize: "0.9375rem", fontWeight: 700, marginBottom: "1rem" }}>
              Контакты и оплата
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
              <a href="tel:+998712000000" style={{ color: "var(--accent-cyan)", fontWeight: 700, fontSize: "1.0625rem" }}>
                +998 (71) 200-00-00
              </a>
              <span style={{ color: "var(--text-muted)" }}>Без выходных, 09:00 - 22:00</span>
              <a href="mailto:support@nexora.uz" style={{ color: "var(--text-secondary)" }}>
                support@nexora.uz
              </a>
              
              {/* Payment badges */}
              <div style={{ marginTop: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Способы оплаты:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  <span style={{ background: "var(--bg-surface)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#FFF", border: "1px solid var(--border-subtle)" }}>
                    Uzcard
                  </span>
                  <span style={{ background: "var(--bg-surface)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", border: "1px solid var(--border-subtle)" }}>
                    Humo
                  </span>
                  <span style={{ background: "var(--bg-surface)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#FFF", border: "1px solid var(--border-subtle)" }}>
                    Payme
                  </span>
                  <span style={{ background: "var(--bg-surface)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#FFF", border: "1px solid var(--border-subtle)" }}>
                    Click
                  </span>
                  <span style={{ background: "var(--bg-surface)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#FFF", border: "1px solid var(--border-subtle)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <CreditCard size={12} /> Visa / MC
                  </span>
                  <span style={{ background: "var(--bg-surface)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-success)", border: "1px solid var(--border-subtle)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <Banknote size={12} /> Наличные
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            © 2026 Nexora Store. Все права защищены. Разработано для рынка Узбекистана.
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>Цены указаны в сумах (UZS)</span>
            <span>·</span>
            <Link href="/admin" style={{ color: "var(--text-muted)" }}>
              Панель администратора
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

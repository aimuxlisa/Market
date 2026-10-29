"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, rgba(8, 12, 19, 0.95) 0%, #04060A 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        paddingTop: "4.5rem",
        paddingBottom: "3rem",
        color: "#CBD5E1",
        position: "relative",
      }}
    >
      <div className="container">
        
        {/* Main Footer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1.35fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
          className="footer-grid-responsive"
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  border: "1.5px solid #C29B63",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(194, 155, 99, 0.1)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#DFC5A0",
                    lineHeight: 1,
                  }}
                >
                  H
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#FFFFFF",
                  }}
                >
                  HAVEN
                </span>
                <span
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.3em",
                    color: "#C29B63",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  ELECTRONICS
                </span>
              </div>
            </div>

            <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.65, maxWidth: "340px", marginBottom: "1.75rem" }}>
              Премиальный интернет-магазин флагманской электроники и техники в Узбекистане. Только оригинальная продукция с официальной гарантией.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.875rem", color: "#8E9BAE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <MapPin size={15} color="#C29B63" />
                <span>г. Ташкент, проспект Амира Темура, 45</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Phone size={15} color="#C29B63" />
                <span>+998 (71) 200-00-00 (Ежедневно 09:00 - 21:00)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Mail size={15} color="#C29B63" />
                <span>concierge@haventech.uz</span>
              </div>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h5
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.1rem",
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "1.25rem",
                letterSpacing: "0.02em",
              }}
            >
              Категории техники
            </h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0 }}>
              <li>
                <Link href="/catalog?category=smartphones" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Смартфоны Apple & Samsung
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=laptops" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Ноутбуки Apple MacBook M4
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=tv-audio" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  OLED Телевизоры & Звук
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=gaming" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Игровые консоли PS5 Pro
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=appliances" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Премиум техника Dyson
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h5
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.1rem",
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "1.25rem",
                letterSpacing: "0.02em",
              }}
            >
              Сервис и клиентам
            </h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0 }}>
              <li>
                <Link href="/about" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/catalog" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Официальная гарантия
                </Link>
              </li>
              <li>
                <Link href="/cart" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Доставка и оплата в сумах
                </Link>
              </li>
              <li>
                <Link href="/account" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Личный кабинет & Заказы
                </Link>
              </li>
              <li>
                <Link href="/favorites" style={{ color: "#8E9BAE", fontSize: "0.875rem", textDecoration: "none" }}>
                  Список избранного
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h5
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.1rem",
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "0.75rem",
                letterSpacing: "0.02em",
              }}
            >
              Спецпредложения и закрытые акции
            </h5>
            <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.55, marginBottom: "1.25rem" }}>
              Получайте первыми уведомления о старте продаж новых флагманов и промокоды на скидку.
            </p>

            {subscribed ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#C29B63",
                  fontSize: "0.875rem",
                  background: "rgba(194, 155, 99, 0.1)",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(194, 155, 99, 0.3)",
                }}
              >
                <CheckCircle2 size={16} />
                <span>Вы успешно подписаны на спецпредложения!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <input
                  type="email"
                  required
                  placeholder="Ваш адрес электронной почты"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "9999px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: "#C29B63",
                    color: "#06080D",
                    borderRadius: "9999px",
                    padding: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>Подписаться на новинки</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8125rem",
            color: "#64748B",
          }}
        >
          <div>
            © {new Date().getFullYear()} HAVEN ELECTRONICS. ВСЕ ПРАВА ЗАЩИЩЕНЫ. ОФИЦИАЛЬНАЯ ТЕХНИКА В УЗБЕКИСТАНЕ.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/about" style={{ color: "#64748B", textDecoration: "none" }}>Политика конфиденциальности</Link>
            <Link href="/about" style={{ color: "#64748B", textDecoration: "none" }}>Условия обслуживания</Link>
            <Link href="/about" style={{ color: "#64748B", textDecoration: "none" }}>Оферта</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

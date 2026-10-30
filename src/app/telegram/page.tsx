"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTelegram } from "@/context/TelegramContext";
import { Button } from "@/components/ui/Button";
import {
  Send,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

export default function TelegramMiniAppPage() {
  const { isTelegram, tgUser, haptic } = useTelegram();
  const [copied, setCopied] = useState(false);

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "lismarket_bot";
  const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const botLink = `https://t.me/${botUsername}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    haptic("light");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "2rem 0 4rem" }}>
        <div className="container" style={{ maxWidth: 840 }}>
          {/* Hero Banner */}
          <div
            style={{
              padding: "2.5rem 2rem",
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, rgba(0, 136, 204, 0.12) 0%, rgba(194, 155, 99, 0.08) 50%, rgba(10, 14, 22, 0.95) 100%)",
              border: "1px solid rgba(0, 136, 204, 0.3)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.45)",
              textAlign: "center",
              marginBottom: "2.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Telegram Watermark Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.9rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(0, 136, 204, 0.18)",
                border: "1px solid rgba(0, 136, 204, 0.4)",
                color: "#38B2AC",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              <Send size={15} />
              Telegram Mini App Integration
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              Haven Electronics в Telegram
            </h1>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                maxWidth: 600,
                margin: "0 auto 1.75rem",
                lineHeight: 1.6,
              }}
            >
              Полноценный каталог техники, мгновенная авторизация через Telegram аккаунт,
              быстрый заказ с тактильным откликом (Haptic Feedback) и интеграция с Telegram WebApp.
            </p>

            {/* Current State Indicator */}
            {isTelegram ? (
              <div
                style={{
                  padding: "1rem 1.25rem",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "var(--radius-md)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "var(--color-success)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={20} />
                Вы уже открыли магазин внутри Telegram Mini App! Привет, {tgUser?.first_name || "Пользователь"}!
              </div>
            ) : (
              <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a href={botLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Send size={18} />}
                    rightIcon={<ExternalLink size={16} />}
                  >
                    Запустить в Telegram
                  </Button>
                </a>
                <Link href="/catalog">
                  <Button variant="outline" size="lg" leftIcon={<ShoppingBag size={18} />}>
                    Перейти в каталог
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "rgba(194, 155, 99, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-gold)",
                  marginBottom: "1rem",
                }}
              >
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "0.5rem" }}>
                Авто-авторизация
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Вход в один клик без ввода паролей. Профиль и сессия автоматически синхронизируются через криптографический `initData`.
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "rgba(0, 136, 204, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38B2AC",
                  marginBottom: "1rem",
                }}
              >
                <Smartphone size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "0.5rem" }}>
                Telegram MainButton
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Нативная кнопка действия Telegram внизу экрана в корзине и при оформлении заказа для максимального удобства.
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-success)",
                  marginBottom: "1rem",
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFF", marginBottom: "0.5rem" }}>
                Haptic Feedback
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Тактильная вибро-отдача смартфона при добавлении в корзину, переключении количества и подтверждении заказа.
              </p>
            </div>
          </div>

          {/* Setup / Instructions for BotFather */}
          <div
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFF", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} color="var(--accent-gold)" /> Как привязать Mini App к своему боту через @BotFather
            </h3>

            <ol style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li>
                Откройте <strong>@BotFather</strong> в Telegram и отправьте команду <code>/newapp</code>.
              </li>
              <li>
                Выберите вашего бота и укажите название (например, <em>Haven Electronics Store</em>).
              </li>
              <li>
                Укажите Web App URL:
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(0, 0, 0, 0.4)",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    marginTop: "0.35rem",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.875rem",
                    color: "var(--accent-gold-light)",
                    wordBreak: "break-all",
                  }}
                >
                  <code>{appUrl}</code>
                  <button
                    onClick={copyUrl}
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: "var(--text-primary)",
                      background: "rgba(255, 255, 255, 0.08)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                    {copied ? "Скопировано" : "Копировать"}
                  </button>
                </div>
              </li>
              <li>
                Загрузите иконку (640x360 px) и выберите короткое имя (short name).
              </li>
              <li>
                Готово! Теперь ссылка <code>t.me/YourBot/app</code> мгновенно открывает магазин прямо в Telegram.
              </li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

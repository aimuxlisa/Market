"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Info, ArrowRight, CheckCircle2, User } from "lucide-react";

function GoogleConsentContent() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state") || "";

  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  const DEMO_GOOGLE_PROFILES = [
    {
      name: "Алишер Каримов",
      email: "alisher.karimov@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
    },
    {
      name: "Диана Темирова",
      email: "diana.temirova@gmail.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(14, 20, 32, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(194, 155, 99, 0.35)",
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(194, 155, 99, 0.15)",
      }}
    >
      {/* Google Logo Header */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "#FFFFFF",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#FFF",
            marginBottom: "0.4rem",
            letterSpacing: "-0.01em",
          }}
        >
          Вход через Google
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#8E9BAE" }}>
          Выберите аккаунт Google для входа в Haven Electronics
        </p>
      </div>

      {/* Account selection list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.75rem" }}>
        {DEMO_GOOGLE_PROFILES.map((profile) => (
          <a
            key={profile.email}
            href={`/api/auth/google/callback?code=mock_code_${encodeURIComponent(profile.email)}&state=${encodeURIComponent(state)}&email=${encodeURIComponent(profile.email)}&name=${encodeURIComponent(profile.name)}&avatar=${encodeURIComponent(profile.avatar)}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              transition: "all 0.2s ease",
              textDecoration: "none",
            }}
            className="value-card-hover"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={profile.avatar}
                alt={profile.name}
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #C29B63" }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, color: "#FFF", fontSize: "0.9375rem" }}>{profile.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "#8E9BAE" }}>{profile.email}</div>
              </div>
            </div>

            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(194, 155, 99, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#DFC5A0",
              }}
            >
              <ArrowRight size={15} />
            </span>
          </a>
        ))}
      </div>

      {/* Custom Account Input Option */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          paddingTop: "1.5rem",
          marginBottom: "1.75rem",
        }}
      >
        <span style={{ fontSize: "0.8125rem", color: "#8E9BAE", display: "block", marginBottom: "0.85rem" }}>
          Или укажите свой Google Email:
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="text"
            placeholder="Ваше имя (например: Сардор)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <input
            type="email"
            placeholder="ваш.email@gmail.com"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          {customEmail.trim() ? (
            <a
              href={`/api/auth/google/callback?code=mock_code_${encodeURIComponent(customEmail)}&state=${encodeURIComponent(state)}&email=${encodeURIComponent(customEmail)}&name=${encodeURIComponent(customName || customEmail.split("@")[0])}`}
              style={{
                background: "#C29B63",
                color: "#06080D",
                borderRadius: "9999px",
                padding: "0.8rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <span>Продолжить как {customName || customEmail}</span>
              <ArrowRight size={15} />
            </a>
          ) : null}
        </div>
      </div>

      <div style={{ textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
        <Link
          href="/auth/login"
          style={{
            color: "#8E9BAE",
            fontSize: "0.875rem",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8E9BAE")}
        >
          Отмена и возврат ко входу
        </Link>
      </div>
    </div>
  );
}

export default function GoogleConsentPage() {
  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "4rem 0 6rem" }}>
        <div className="container" style={{ maxWidth: "520px" }}>
          <Suspense fallback={<div style={{ textAlign: "center", color: "#8E9BAE", padding: "3rem" }}>Загрузка Google Auth...</div>}>
            <GoogleConsentContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}

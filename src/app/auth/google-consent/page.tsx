"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Info, ArrowRight } from "lucide-react";

function GoogleConsentContent() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state") || "";

  const DEMO_GOOGLE_PROFILES = [
    {
      name: "Alex Nexora",
      email: "alex.nexora@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
    },
    {
      name: "Diana Tech",
      email: "diana.tech@gmail.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    },
  ];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-xl)",
        padding: "2.5rem 2rem",
        boxShadow: "0 0 35px rgba(0, 229, 255, 0.12)",
      }}
    >
      {/* Google Logo Header */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#FFFFFF",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
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

        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFF", marginBottom: "0.4rem", letterSpacing: "-0.02em" }}>
          Вход через Google
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Nexora Store запрашивает доступ к вашему профилю и email
        </p>
      </div>

      {/* Info notice about credentials */}
      <div
        style={{
          background: "rgba(0, 229, 255, 0.08)",
          border: "1px solid rgba(0, 229, 255, 0.25)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.25rem",
          marginBottom: "1.75rem",
          display: "flex",
          gap: "0.75rem",
          fontSize: "0.8125rem",
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        <Info size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong style={{ color: "var(--accent-cyan)", display: "block", marginBottom: "0.2rem" }}>
            Режим разработки (T5.3):
          </strong>
          Переменные <code style={{ color: "#FFF", background: "rgba(255,255,255,0.1)", padding: "2px 5px", borderRadius: "4px" }}>GOOGLE_CLIENT_ID</code> и{" "}
          <code style={{ color: "#FFF", background: "rgba(255,255,255,0.1)", padding: "2px 5px", borderRadius: "4px" }}>GOOGLE_CLIENT_SECRET</code> можно указать в файле <code style={{ color: "#FFF" }}>.env</code>. Выберите тестовый аккаунт для мгновенной проверки полного цикла OAuth:
        </div>
      </div>

      {/* Account selection list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
        {DEMO_GOOGLE_PROFILES.map((profile) => (
          <a
            key={profile.email}
            href={`/api/auth/google/callback?code=mock_code_${encodeURIComponent(profile.email)}&state=${encodeURIComponent(state)}&email=${encodeURIComponent(profile.email)}&name=${encodeURIComponent(profile.name)}&avatar=${encodeURIComponent(profile.avatar)}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              transition: "all var(--transition-fast)",
              textDecoration: "none",
            }}
            className="google-profile-option"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={profile.avatar}
                alt={profile.name}
                style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-cyan)" }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, color: "#FFF", fontSize: "0.9375rem" }}>{profile.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{profile.email}</div>
              </div>
            </div>

            <ArrowRight size={18} color="var(--accent-cyan)" />
          </a>
        ))}
      </div>

      <div style={{ textAlign: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
        <Link href="/auth/login">
          <Button variant="secondary" size="sm">
            Отмена и возврат ко входу
          </Button>
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
          <Suspense fallback={<div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>Загрузка Google Auth...</div>}>
            <GoogleConsentContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}

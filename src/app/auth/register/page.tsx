"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, User, Phone, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Пароль должен быть не менее 6 символов.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Ошибка регистрации");
        return;
      }

      // Successful registration -> redirect to account
      router.push("/account");
      router.refresh();
    } catch {
      setErrorMessage("Ошибка подключения к серверу. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "3rem 0 5rem" }}>
        <div className="container" style={{ maxWidth: "480px" }}>
          
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem 2rem",
              boxShadow: "0 0 30px rgba(0, 229, 255, 0.08)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: "#FFF",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                N
              </div>
              <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFF", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                Создать аккаунт
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Присоединяйтесь к Nexora Store и получайте персональные скидки
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: "#FF6B6B",
                  fontSize: "0.875rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ваше имя</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <User size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    required
                    placeholder="Алишер Каримов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Номер телефона</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Phone size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Пароль (минимум 6 символов)</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Lock size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Повторите пароль</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Lock size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                style={{ width: "100%", marginTop: "0.5rem" }}
                rightIcon={<ArrowRight size={18} />}
              >
                Зарегистрироваться
              </Button>
            </form>

            {/* Social Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "0.75rem" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>или</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
            </div>

            {/* Google OAuth Button */}
            <a href="/api/auth/google" style={{ textDecoration: "none", width: "100%", display: "block" }}>
              <button
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  padding: "0.85rem 1.25rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-md)",
                  color: "#FFF",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
                className="google-signin-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Зарегистрироваться с Google
              </button>
            </a>

            <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
                Войти
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

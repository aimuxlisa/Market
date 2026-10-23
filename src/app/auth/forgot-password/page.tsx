"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsSuccess(true);
      setMessage(data.message || "Инструкция отправлена.");
    } catch {
      setIsSuccess(true);
      setMessage("Если указанный email зарегистрирован в системе, мы отправили инструкции по сбросу пароля.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "3rem 0 5rem" }}>
        <div className="container" style={{ maxWidth: "460px" }}>
          
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
              <h1 className="font-display" style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFF", marginBottom: "0.5rem" }}>
                Восстановление пароля
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Укажите адрес электронной почты, связанный с вашим аккаунтом
              </p>
            </div>

            {isSuccess ? (
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--color-success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={28} />
                </div>
                <p style={{ color: "var(--text-primary)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  {message}
                </p>
                <Link href="/auth/login" style={{ width: "100%", marginTop: "1rem" }}>
                  <Button variant="secondary" size="md" style={{ width: "100%" }} leftIcon={<ArrowLeft size={16} />}>
                    Вернуться ко входу
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Отправить ссылку
                </Button>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Link href="/auth/login" style={{ color: "var(--accent-cyan)", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <ArrowLeft size={14} /> Назад ко входу
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

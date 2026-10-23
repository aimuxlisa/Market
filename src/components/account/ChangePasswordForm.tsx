"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Lock, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Новые пароли не совпадают.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Новый пароль должен содержать не менее 6 символов.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/account/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Не удалось изменить пароль");
        return;
      }

      setSuccessMessage("Пароль успешно обновлён!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {successMessage && (
        <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "var(--radius-md)", padding: "0.85rem 1rem", color: "var(--color-success)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={16} /> <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-md)", padding: "0.85rem 1rem", color: "#FF6B6B", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={16} /> <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Текущий пароль *</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <KeyRound size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Новый пароль (мин. 6 символов) *</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Lock size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Повторите новый пароль *</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Lock size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Обновить пароль
        </Button>
      </div>
    </form>
  );
};

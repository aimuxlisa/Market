"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { User, Phone, Mail, ImageIcon, CheckCircle, AlertCircle, Save } from "lucide-react";

interface ProfileEditFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
];

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user }) => {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, avatarUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Не удалось сохранить данные");
        return;
      }

      setSuccessMessage("Профиль успешно обновлён!");
      router.refresh();
    } catch {
      setErrorMessage("Ошибка подключения к серверу. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectInitialsAvatar = () => {
    setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim() || "User")}`);
  };

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {successMessage && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "var(--color-success)",
            fontSize: "0.875rem",
          }}
        >
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

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
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Avatar Selector Section */}
      <div>
        <label className="form-label" style={{ marginBottom: "0.75rem", display: "block" }}>
          Аватар профиля
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <img
            src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "User")}`}
            alt="Превью"
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--accent-cyan)",
              boxShadow: "0 0 16px rgba(0, 229, 255, 0.3)",
            }}
          />

          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Выберите готовую аватарку или сгенерируйте по инициалам:
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${avatarUrl === url ? "var(--accent-cyan)" : "var(--border-card)"}`,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <img src={url} alt={`preset-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleSelectInitialsAvatar}>
                Инициалы
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Имя и фамилия</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <User size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Email (основной логин)</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Mail size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
          <input
            type="email"
            disabled
            value={user.email}
            className="input"
            style={{ paddingLeft: "2.75rem", opacity: 0.7, cursor: "not-allowed" }}
          />
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Email привязан к вашей учетной записи и не подлежит изменению.
        </span>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">URL изображения аватарки (необязательно)</label>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <ImageIcon size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)" }} />
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="input"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          variant="cyan"
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<Save size={18} />}
        >
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
};

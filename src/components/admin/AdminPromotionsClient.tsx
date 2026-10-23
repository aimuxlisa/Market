"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  desktopImage: string;
  mobileImage?: string | null;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export const AdminPromotionsClient: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "Хит",
    desktopImage: "",
    href: "/catalog",
    sortOrder: "1",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      if (res.ok) {
        const d = await res.json();
        setPromotions(d.promotions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const openCreateModal = () => {
    setEditingPromo(null);
    setFormData({
      title: "",
      subtitle: "",
      badge: "Хит",
      desktopImage: "",
      href: "/catalog",
      sortOrder: (promotions.length + 1).toString(),
      isActive: true,
    });
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p);
    setFormData({
      title: p.title,
      subtitle: p.subtitle || "",
      badge: p.badge || "",
      desktopImage: p.desktopImage,
      href: p.href,
      sortOrder: p.sortOrder.toString(),
      isActive: p.isActive,
    });
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      badge: formData.badge,
      desktopImage: formData.desktopImage,
      href: formData.href,
      sortOrder: parseInt(formData.sortOrder, 10) || 0,
      isActive: formData.isActive,
    };

    try {
      const url = editingPromo ? `/api/admin/promotions/${editingPromo.id}` : "/api/admin/promotions";
      const method = editingPromo ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка сохранения");
      }

      setModalOpen(false);
      fetchPromotions();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить баннер "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Не удалось удалить баннер");
        return;
      }
      fetchPromotions();
    } catch {
      alert("Ошибка при удалении баннера");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-card)",
          padding: "1.25rem 1.5rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-card)",
        }}
      >
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Баннеров на главной: <span style={{ color: "#FFF", fontWeight: 700 }}>{promotions.length}</span>
        </div>
        <button type="button" onClick={openCreateModal} className="btn btn-cyan btn-sm">
          <Plus size={16} /> Создать баннер
        </button>
      </div>

      {/* Grid of promotions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1" }}>
            Загрузка баннеров...
          </div>
        ) : promotions.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1" }}>
            Баннеры не созданы
          </div>
        ) : (
          promotions.map((p) => (
            <div
              key={p.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: 160,
                  position: "relative",
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${p.desktopImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {p.badge && (
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        background: "rgba(255, 70, 70, 0.9)",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>{p.title}</div>
              </div>

              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {p.subtitle && (
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{p.subtitle}</p>
                )}
                <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", wordBreak: "break-all" }}>
                  Ссылка: {p.href}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.75rem", color: p.isActive ? "var(--color-success)" : "var(--text-muted)", fontWeight: 700 }}>
                    {p.isActive ? "Активен" : "Отключен"} · №{p.sortOrder}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ width: 34, height: 34 }}
                      onClick={() => openEditModal(p)}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ width: 34, height: 34, color: "var(--color-danger)" }}
                      onClick={() => handleDelete(p.id, p.title)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "520px",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF" }}>
                {editingPromo ? "Редактировать баннер" : "Новый промо-баннер"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--color-danger)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Заголовок баннера *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Флагманы 2026: Новая эра скорости"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Подзаголовок</label>
                <input
                  type="text"
                  className="input"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="iPhone 16 Pro и Galaxy S25 в наличии"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Бейдж</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Хит сезона / Скидка 15%"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Порядок</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">URL изображения *</label>
                <input
                  type="url"
                  required
                  className="input"
                  value={formData.desktopImage}
                  onChange={(e) => setFormData({ ...formData, desktopImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ссылка перехода *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/catalog/smartphones"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#FFF", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "var(--accent-cyan)" }}
                  />
                  Показывать на главной странице
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Отмена
                </button>
                <button type="submit" disabled={submitting} className="btn btn-cyan btn-sm">
                  {submitting ? "Сохранение..." : editingPromo ? "Сохранить" : "Создать баннер"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

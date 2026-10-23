"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export const AdminCategoriesClient: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Smartphone",
    sortOrder: "1",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const d = await res.json();
        setCategories(d.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "Smartphone",
      sortOrder: (categories.length + 1).toString(),
      isActive: true,
    });
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "Smartphone",
      sortOrder: c.sortOrder.toString(),
      isActive: c.isActive,
    });
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      icon: formData.icon,
      sortOrder: parseInt(formData.sortOrder, 10) || 0,
      isActive: formData.isActive,
    };

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";
      const method = editingCategory ? "PATCH" : "POST";

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
      fetchCategories();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить категорию "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Не удалось удалить категорию");
        return;
      }
      fetchCategories();
    } catch {
      alert("Ошибка при удалении категории");
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
          Всего категорий: <span style={{ color: "#FFF", fontWeight: 700 }}>{categories.length}</span>
        </div>
        <button type="button" onClick={openCreateModal} className="btn btn-cyan btn-sm">
          <Plus size={16} /> Создать категорию
        </button>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-card)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.02)" }}>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Название</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Slug</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Иконка</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Товаров</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Порядок</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Статус</th>
                <th style={{ padding: "1rem", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Загрузка категорий...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Категории не найдены
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#FFF" }}>{c.name}</td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{c.slug}</td>
                    <td style={{ padding: "1rem", color: "var(--accent-cyan)" }}>{c.icon}</td>
                    <td style={{ padding: "1rem", color: "#FFF", fontWeight: 700 }}>
                      {c._count?.products || 0}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{c.sortOrder}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: c.isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.1)",
                          color: c.isActive ? "var(--color-success)" : "var(--text-muted)",
                        }}
                      >
                        {c.isActive ? "Активна" : "Скрыта"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: 34, height: 34 }}
                          onClick={() => openEditModal(c)}
                          title="Редактировать"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: 34, height: 34, color: "var(--color-danger)" }}
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Удалить"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                {editingCategory ? "Редактировать категорию" : "Новая категория"}
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
                <label className="form-label">Название категории *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Смартфоны и гаджеты"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Slug (URL)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="smartphones"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Иконка (Lucide)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Smartphone / Laptop / Tv"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Порядок сортировки</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, justifyContent: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.6rem", color: "#FFF", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: "var(--accent-cyan)" }}
                    />
                    Активна на сайте
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Описание</label>
                <textarea
                  rows={2}
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Краткое описание категории..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Отмена
                </button>
                <button type="submit" disabled={submitting} className="btn btn-cyan btn-sm">
                  {submitting ? "Сохранение..." : editingCategory ? "Сохранить" : "Создать категорию"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

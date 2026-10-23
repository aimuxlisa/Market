"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/format";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  status: string;
  categoryId: string;
  description: string;
  images: { url: string }[];
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export const AdminProductsClient: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    categoryId: "",
    price: "",
    oldPrice: "",
    stock: "10",
    status: "PUBLISHED",
    description: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/products?search=${encodeURIComponent(search)}&limit=50`),
        fetch("/api/admin/categories"),
      ]);

      if (prodRes.ok) {
        const d = await prodRes.json();
        setProducts(d.products || []);
      }
      if (catRes.ok) {
        const cd = await catRes.json();
        setCategories(cd.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      brand: "",
      categoryId: categories[0]?.id || "",
      price: "",
      oldPrice: "",
      stock: "10",
      status: "PUBLISHED",
      description: "",
      imageUrl: "",
    });
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      categoryId: p.categoryId,
      price: p.price.toString(),
      oldPrice: p.oldPrice ? p.oldPrice.toString() : "",
      stock: p.stock.toString(),
      status: p.status,
      description: p.description || "",
      imageUrl: p.images[0]?.url || "",
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
      sku: formData.sku,
      brand: formData.brand,
      categoryId: formData.categoryId,
      price: parseInt(formData.price, 10),
      oldPrice: formData.oldPrice ? parseInt(formData.oldPrice, 10) : null,
      stock: parseInt(formData.stock, 10),
      status: formData.status,
      description: formData.description,
      images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
    };

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";

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
      fetchData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы действительно хотите удалить товар "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Не удалось удалить товар");
        return;
      }
      fetchData();
    } catch {
      alert("Ошибка при удалении товара");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top action bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          background: "var(--bg-card)",
          padding: "1.25rem 1.5rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-card)",
        }}
      >
        <div style={{ position: "relative", minWidth: 260, flex: 1, maxWidth: 400 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="input"
            placeholder="Поиск по названию, бренду, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.2rem" }}
          />
        </div>

        <button type="button" onClick={openCreateModal} className="btn btn-cyan btn-sm">
          <Plus size={16} /> Создать товар
        </button>
      </div>

      {/* Table */}
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
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Товар</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Артикул</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Категория</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Цена</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Остаток</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Статус</th>
                <th style={{ padding: "1rem", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Загрузка списка товаров...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Товары не найдены
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.15s" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "8px",
                            background: "var(--bg-surface)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {p.images[0]?.url ? (
                            <img src={p.images[0].url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Нет фото</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#FFF" }}>{p.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)" }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)", fontFamily: "monospace" }}>{p.sku}</td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{p.category?.name || "—"}</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#FFF" }}>{formatPrice(p.price)}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ color: p.stock > 0 ? "var(--color-success)" : "var(--color-danger)", fontWeight: 700 }}>
                        {p.stock} шт.
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: p.status === "PUBLISHED" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.1)",
                          color: p.status === "PUBLISHED" ? "var(--color-success)" : "var(--text-muted)",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: 34, height: 34 }}
                          onClick={() => openEditModal(p)}
                          title="Редактировать"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: 34, height: 34, color: "var(--color-danger)" }}
                          onClick={() => handleDelete(p.id, p.name)}
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

      {/* Modal Edit/Create */}
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
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF" }}>
                {editingProduct ? "Редактировать товар" : "Новый товар"}
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
                <label className="form-label">Название товара *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Смартфон Artel U5 4GB/64GB"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Артикул (SKU) *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="ART-U5-64"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Бренд *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Artel / Apple / Xiaomi"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Категория *</label>
                <select
                  required
                  className="select"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="" disabled>Выберите категорию</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Цена (UZS) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    className="input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1390000"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Старая цена</label>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="1550000"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Остаток на складе</label>
                  <input
                    type="number"
                    required
                    min={0}
                    className="input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">URL фото товара</label>
                <input
                  type="url"
                  className="input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Описание товара</label>
                <textarea
                  rows={3}
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Характеристики и описание..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Отмена
                </button>
                <button type="submit" disabled={submitting} className="btn btn-cyan btn-sm">
                  {submitting ? "Сохранение..." : editingProduct ? "Сохранить изменения" : "Создать товар"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface Address {
  id: string;
  city: string;
  street: string;
  building: string;
  apartment: string | null;
  comment: string | null;
  isDefault: boolean;
}

interface AddressBookManagerProps {
  initialAddresses: Address[];
}

export const AddressBookManager: React.FC<AddressBookManagerProps> = ({ initialAddresses }) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [city, setCity] = useState("Ташкент");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!city || !street || !building) {
      setErrorMessage("Заполните город, улицу и дом.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, street, building, apartment, comment, isDefault }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Не удалось сохранить адрес");
        return;
      }

      setAddresses((prev) => [data.address, ...prev]);
      setShowAddForm(false);
      setStreet("");
      setBuilding("");
      setApartment("");
      setComment("");
      setIsDefault(false);
      setSuccessMessage("Адрес успешно добавлен!");
    } catch {
      setErrorMessage("Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
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

      {/* Add Address Button or Form */}
      {!showAddForm ? (
        <div>
          <Button variant="cyan" size="md" leftIcon={<Plus size={18} />} onClick={() => setShowAddForm(true)}>
            Добавить новый адрес
          </Button>
        </div>
      ) : (
        <form onSubmit={handleAddAddress} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.15rem" }}>
          <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#FFF" }}>Новый адрес доставки</h4>

          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Город *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="select">
                <option value="Ташкент">Ташкент</option>
                <option value="Самарканд">Самарканд</option>
                <option value="Бухара">Бухара</option>
                <option value="Фергана">Фергана</option>
                <option value="Андижан">Андижан</option>
                <option value="Наманган">Наманган</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Улица *</label>
              <input type="text" required placeholder="проспект Амира Темура" value={street} onChange={(e) => setStreet(e.target.value)} className="input" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Дом / Корпус *</label>
              <input type="text" required placeholder="45" value={building} onChange={(e) => setBuilding(e.target.value)} className="input" />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Квартира / Офис</label>
              <input type="text" placeholder="12" value={apartment} onChange={(e) => setApartment(e.target.value)} className="input" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Комментарий для курьера (домофон, этаж)</label>
            <input type="text" placeholder="Домофон 12В, 3 этаж" value={comment} onChange={(e) => setComment(e.target.value)} className="input" />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              <span>Использовать как основной адрес по умолчанию</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              Сохранить адрес
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={() => setShowAddForm(false)}>
              Отмена
            </Button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {addresses.map((addr) => (
          <div
            key={addr.id}
            style={{
              background: "var(--bg-surface)",
              border: `1.5px solid ${addr.isDefault ? "var(--accent-cyan)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "1rem",
              position: "relative",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 700, color: "#FFF", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <MapPin size={16} color="var(--accent-cyan)" /> {addr.city}
                </span>
                {addr.isDefault && <Badge variant="cyan">Основной</Badge>}
              </div>

              <div style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                {addr.street}, д. {addr.building}
                {addr.apartment ? `, кв. ${addr.apartment}` : ""}
              </div>

              {addr.comment && (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                  {addr.comment}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => handleDeleteAddress(addr.id)}
                style={{
                  color: "var(--text-muted)",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.8125rem",
                }}
              >
                <Trash2 size={14} /> Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

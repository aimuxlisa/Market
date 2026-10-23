"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";
import { Search, Eye, X } from "lucide-react";

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryMethod: string;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const ORDER_STATUSES = [
  { value: "pending", label: "Ожидает подтверждения" },
  { value: "confirmed", label: "Подтвержден" },
  { value: "processing", label: "В обработке" },
  { value: "shipped", label: "Передан курьеру" },
  { value: "delivered", label: "Доставлен клиенту" },
  { value: "cancelled", label: "Отменен" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Ожидает оплаты" },
  { value: "paid", label: "Оплачен" },
  { value: "failed", label: "Ошибка оплаты" },
  { value: "refunded", label: "Возврат средств" },
];

export const AdminOrdersClient: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adminComment, setAdminComment] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(search)}&limit=50`);
      if (res.ok) {
        const d = await res.json();
        setOrders(d.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (newStatus?: string, newPaymentStatus?: string) => {
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus || selectedOrder.status,
          paymentStatus: newPaymentStatus || selectedOrder.paymentStatus,
          adminComment: adminComment.trim() || undefined,
        }),
      });

      const d = await res.json();
      if (!res.ok) {
        alert(d.error || "Ошибка при смене статуса");
        return;
      }

      setSelectedOrder({ ...selectedOrder, status: d.order.status, paymentStatus: d.order.paymentStatus });
      setAdminComment("");
      fetchOrders();
    } catch {
      alert("Не удалось обновить статус");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Filters */}
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
        <div style={{ display: "flex", gap: "1rem", flex: 1, flexWrap: "wrap" }}>
          <div style={{ position: "relative", minWidth: 260, flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input"
              placeholder="Номер заказа, имя, телефон..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "2.2rem" }}
            />
          </div>

          <select
            className="select"
            style={{ width: "auto", minWidth: 200 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Все статусы заказа</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Номер</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Клиент</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Телефон / Адрес</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Сумма</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Статус заказа</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Оплата</th>
                <th style={{ padding: "1rem", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Загрузка заказов...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Заказы не найдены
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 700, color: "#FFF" }}>{ord.orderNumber}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(ord.createdAt)}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 600, color: "#FFF" }}>{ord.customerName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ord.items.length} поз.</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>{ord.customerPhone}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ord.deliveryCity}, {ord.deliveryAddress}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#FFF" }}>{formatPrice(ord.total)}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: ord.status === "delivered" ? "rgba(16, 185, 129, 0.15)" : ord.status === "cancelled" ? "rgba(239, 68, 68, 0.15)" : "rgba(0, 229, 255, 0.12)",
                          color: ord.status === "delivered" ? "var(--color-success)" : ord.status === "cancelled" ? "var(--color-danger)" : "var(--accent-cyan)",
                        }}
                      >
                        {ORDER_STATUS_LABELS[ord.status]?.label || ord.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: ord.paymentStatus === "paid" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: ord.paymentStatus === "paid" ? "var(--color-success)" : "var(--color-warning)",
                        }}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setModalOpen(true);
                        }}
                      >
                        <Eye size={14} /> Детали
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {modalOpen && selectedOrder && (
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
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF" }}>
                  Заказ {selectedOrder.orderNumber}
                </h3>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                  Оформлен {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Status change controls */}
            <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#FFF", marginBottom: "0.75rem" }}>
                Смена статусов заказа и оплаты:
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="form-label">Статус заказа</label>
                  <select
                    className="select"
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(e.target.value, undefined)}
                    disabled={updating}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Статус оплаты</label>
                  <select
                    className="select"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleUpdateStatus(undefined, e.target.value)}
                    disabled={updating}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Комментарий администратора (для аудита)</label>
                <input
                  type="text"
                  className="input"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Причина отмены, трек-номер доставки и т.д."
                />
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Данные клиента и адрес:
              </h4>
              <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}>
                <div><strong>Имя:</strong> {selectedOrder.customerName}</div>
                <div><strong>Телефон:</strong> {selectedOrder.customerPhone}</div>
                <div><strong>Город:</strong> {selectedOrder.deliveryCity}</div>
                <div><strong>Адрес:</strong> {selectedOrder.deliveryAddress}</div>
                <div><strong>Способ оплаты:</strong> {selectedOrder.paymentMethod}</div>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Состав заказа:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedOrder.items.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      background: "var(--bg-card)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#FFF" }}>{it.productNameSnapshot}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{it.quantity} x {formatPrice(it.unitPrice)}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--accent-cyan)" }}>
                      {formatPrice(it.lineTotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, color: "#FFF" }}>
              <span>Итого:</span>
              <span style={{ color: "var(--accent-cyan)" }}>{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

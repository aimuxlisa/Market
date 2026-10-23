"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChevronRight,
  Tag,
} from "lucide-react";

export default function CartPage() {
  const { items, subtotal, totalCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === "NEXORA10") {
      setAppliedPromo({ code: "NEXORA10", percent: 10 });
    } else if (cleaned === "PROMO20") {
      setAppliedPromo({ code: "PROMO20", percent: 20 });
    } else {
      setPromoError("Промокод не найден или срок действия истек");
    }
  };

  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.percent) / 100) : 0;
  const deliveryFee = subtotal >= 1000000 || subtotal === 0 ? 0 : 25000;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "1.5rem 0 4rem" }}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            <Link href="/" style={{ color: "var(--text-secondary)" }}>
              Главная
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Корзина</span>
          </nav>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.35rem)",
                fontWeight: 800,
                color: "#FFFFFF",
              }}
            >
              Корзина товаров
            </h1>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={14} /> Очистить всё
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2.5rem",
                alignItems: "flex-start",
              }}
            >
              {/* Left Column: Cart Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-card)",
                      borderRadius: "var(--radius-xl)",
                      padding: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      position: "relative",
                    }}
                  >
                    {/* Item Image */}
                    <Link
                      href={`/product/${item.slug}`}
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: "var(--radius-md)",
                        background: "rgba(8, 12, 22, 0.4)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: "0.5rem",
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </Link>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--accent-cyan)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.brand}
                      </span>
                      <Link href={`/product/${item.slug}`}>
                        <h3
                          style={{
                            fontSize: "0.9375rem",
                            fontWeight: 600,
                            color: "#FFF",
                            marginBottom: "0.35rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </h3>
                      </Link>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        {formatPrice(item.price)} / шт.
                      </div>

                      {/* Quantity & Controls */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-card)",
                            borderRadius: "var(--radius-md)",
                            padding: "0.15rem",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            style={{
                              width: 30,
                              height: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--text-primary)",
                            }}
                            aria-label="Уменьшить"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: "0.875rem" }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            style={{
                              width: 30,
                              height: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: item.quantity >= item.maxStock ? "var(--text-muted)" : "var(--text-primary)",
                            }}
                            aria-label="Увеличить"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="font-display" style={{ fontWeight: 800, fontSize: "1.125rem", color: "#FFF" }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        color: "var(--text-muted)",
                        transition: "color var(--transition-fast)",
                      }}
                      title="Удалить из корзины"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {/* Continue Shopping Button */}
                <div style={{ marginTop: "1rem" }}>
                  <Link href="/catalog" style={{ color: "var(--accent-cyan)", fontSize: "0.875rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    ← Продолжить покупки в каталоге
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-xl)",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  position: "sticky",
                  top: "100px",
                }}
              >
                <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF" }}>
                  Сумма заказа
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Промокод (NEXORA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="input"
                      style={{ fontSize: "0.8125rem", textTransform: "uppercase" }}
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Применить
                    </Button>
                  </div>
                  {promoError && (
                    <span style={{ fontSize: "0.75rem", color: "var(--color-danger)" }}>
                      {promoError}
                    </span>
                  )}
                  {appliedPromo && (
                    <span style={{ fontSize: "0.75rem", color: "var(--color-success)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Tag size={12} /> Промокод {appliedPromo.code} активен (-{appliedPromo.percent}%)
                    </span>
                  )}
                </form>

                {/* Subtotals breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", padding: "1rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Товары ({totalCount} шт.)</span>
                    <span style={{ color: "#FFF", fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--color-success)" }}>
                      <span>Скидка по промокоду</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Доставка</span>
                    <span style={{ color: deliveryFee === 0 ? "var(--color-success)" : "#FFF", fontWeight: 600 }}>
                      {deliveryFee === 0 ? "Бесплатно" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "#FFF" }}>Итого:</span>
                  <span
                    className="font-display"
                    style={{
                      fontSize: "1.65rem",
                      fontWeight: 800,
                      color: "var(--accent-cyan)",
                    }}
                  >
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button variant="primary" size="lg" style={{ width: "100%" }} rightIcon={<ArrowRight size={18} />}>
                    Перейти к оформлению
                  </Button>
                </Link>

                {/* Guarantees */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldCheck size={16} color="var(--accent-cyan)" /> Официальная гарантия на все товары
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Truck size={16} color="var(--accent-coral)" /> Бесплатная доставка от 1 000 000 сум
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<ShoppingBag size={40} />}
              title="Ваша корзина пуста"
              description="В корзине пока нет добавленных товаров. Загляните в каталог, чтобы выбрать топовые флагманы и технику."
              actionText="Перейти в каталог"
              actionHref="/catalog"
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

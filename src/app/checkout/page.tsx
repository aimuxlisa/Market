"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/context/TelegramContext";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import {
  Truck,
  CreditCard,
  Banknote,
  Building,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalCount, clearCart } = useCart();
  const { tgUser, haptic } = useTelegram();

  const [customerName, setCustomerName] = useState(
    tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") : ""
  );
  const [customerPhone, setCustomerPhone] = useState("+998 ");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Ташкент");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update name if Telegram user loaded
  React.useEffect(() => {
    if (tgUser && !customerName) {
      const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ");
      if (name) setCustomerName(name);
    }
  }, [tgUser, customerName]);

  const deliveryFee =
    deliveryMethod === "express"
      ? 45000
      : deliveryMethod === "pickup"
      ? 0
      : subtotal >= 1000000
      ? 0
      : 25000;

  const finalTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage("Пожалуйста, заполните контактные данные и адрес доставки.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Ваша корзина пуста.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customerName,
          customerPhone,
          customerEmail,
          deliveryCity,
          deliveryAddress,
          deliveryMethod,
          paymentMethod,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Не удалось оформить заказ");
        return;
      }

      // Order created successfully!
      haptic("success");
      clearCart();

      if (paymentMethod === "stripe") {
        try {
          const stripeRes = await fetch("/api/payments/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId }),
          });
          const stripeData = await stripeRes.json();
          if (stripeRes.ok && stripeData.url) {
            window.location.href = stripeData.url;
            return;
          }
        } catch (e) {
          console.error("Stripe redirect failed:", e);
        }
      }

      router.push(`/order/success/${data.orderId}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Ошибка подключения к серверу. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="main-content" style={{ padding: "4rem 0" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <h2 className="font-display" style={{ fontSize: "1.75rem", color: "#FFF", marginBottom: "1rem" }}>
              В корзине нет товаров
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              Для оформления заказа добавьте хотя бы один товар из каталога.
            </p>
            <Link href="/catalog">
              <Button variant="cyan" size="md">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
            <Link href="/cart" style={{ color: "var(--text-secondary)" }}>
              Корзина
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Оформление заказа</span>
          </nav>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.35rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "2rem",
            }}
          >
            Оформление заказа
          </h1>

          {errorMessage && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-md)",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#FF6B6B",
                marginBottom: "2rem",
                fontSize: "0.9375rem",
              }}
            >
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2.5rem",
                alignItems: "flex-start",
              }}
            >
              {/* Left Column: Checkout Inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                
                {/* 1. Contact Information */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.75rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFF", marginBottom: "1.25rem" }}>
                    1. Контактные данные
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Ваше имя и фамилия *</label>
                      <input
                        type="text"
                        required
                        placeholder="Алишер Каримов"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Номер телефона *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 90 123 45 67"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Электронная почта (для чека)</label>
                    <input
                      type="email"
                      placeholder="alisher@example.uz"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                {/* 2. Delivery Method & Address */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.75rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFF", marginBottom: "1.25rem" }}>
                    2. Способ и адрес доставки
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <div
                      onClick={() => setDeliveryMethod("standard")}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${deliveryMethod === "standard" ? "var(--accent-cyan)" : "var(--border-card)"}`,
                        background: deliveryMethod === "standard" ? "rgba(0, 229, 255, 0.08)" : "var(--bg-surface)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.25rem" }}>
                        <Truck size={18} color="var(--accent-cyan)" /> Стандартная
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>1-2 дня по Узбекистану</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--accent-cyan)", fontWeight: 700, marginTop: "0.5rem" }}>
                        {subtotal >= 1000000 ? "Бесплатно" : "25 000 сум"}
                      </div>
                    </div>

                    <div
                      onClick={() => setDeliveryMethod("express")}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${deliveryMethod === "express" ? "var(--accent-cyan)" : "var(--border-card)"}`,
                        background: deliveryMethod === "express" ? "rgba(0, 229, 255, 0.08)" : "var(--bg-surface)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.25rem" }}>
                        <Truck size={18} color="var(--accent-coral)" /> Экспресс
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>От 2 часов по Ташкенту</div>
                      <div style={{ fontSize: "0.8125rem", color: "#FFF", fontWeight: 700, marginTop: "0.5rem" }}>
                        45 000 сум
                      </div>
                    </div>

                    <div
                      onClick={() => setDeliveryMethod("pickup")}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${deliveryMethod === "pickup" ? "var(--accent-cyan)" : "var(--border-card)"}`,
                        background: deliveryMethod === "pickup" ? "rgba(0, 229, 255, 0.08)" : "var(--bg-surface)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.25rem" }}>
                        <Building size={18} color="var(--color-success)" /> Самовывоз
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Шоурум в Ташкенте</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-success)", fontWeight: 700, marginTop: "0.5rem" }}>
                        Бесплатно
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Город *</label>
                      <select
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="select"
                      >
                        <option value="Ташкент">Ташкент</option>
                        <option value="Самарканд">Самарканд</option>
                        <option value="Бухара">Бухара</option>
                        <option value="Фергана">Фергана</option>
                        <option value="Андижан">Андижан</option>
                        <option value="Наманган">Наманган</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Адрес доставки *</label>
                      <input
                        type="text"
                        required
                        placeholder="Улица, дом, квартира / офис, ориентир"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Комментарий для курьера</label>
                    <textarea
                      placeholder="Код домофона, удобное время звонка или доставки..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="textarea"
                      rows={2}
                    />
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.75rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFF", marginBottom: "1.25rem" }}>
                    3. Способ оплаты
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <label
                      onClick={() => setPaymentMethod("stripe")}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${paymentMethod === "stripe" ? "#635BFF" : "var(--border-card)"}`,
                        background: paymentMethod === "stripe" ? "rgba(99, 91, 255, 0.12)" : "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ background: "#635BFF", color: "#FFF", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", letterSpacing: "0.03em" }}>
                          stripe
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#FFF", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            Онлайн-оплата картой через Stripe
                            <span style={{ fontSize: "0.7rem", color: "#A78BFA", background: "rgba(167, 139, 250, 0.15)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>Этап 7</span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Visa, Mastercard, тестовые карты Stripe (3D Secure)</div>
                        </div>
                      </div>
                      {paymentMethod === "stripe" && <CheckCircle2 size={18} color="#635BFF" />}
                    </label>

                    <label
                      onClick={() => setPaymentMethod("cash")}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${paymentMethod === "cash" ? "var(--accent-cyan)" : "var(--border-card)"}`,
                        background: paymentMethod === "cash" ? "rgba(0, 229, 255, 0.08)" : "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Banknote size={20} color="var(--color-success)" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#FFF" }}>Наличными при получении</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Оплата курьеру после проверки товара</div>
                        </div>
                      </div>
                      {paymentMethod === "cash" && <CheckCircle2 size={18} color="var(--accent-cyan)" />}
                    </label>

                    <label
                      onClick={() => setPaymentMethod("card_on_delivery")}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${paymentMethod === "card_on_delivery" ? "var(--accent-cyan)" : "var(--border-card)"}`,
                        background: paymentMethod === "card_on_delivery" ? "rgba(0, 229, 255, 0.08)" : "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <CreditCard size={20} color="var(--accent-cyan)" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#FFF" }}>Картой курьеру (Uzcard / Humo / Visa)</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Оплата через мобильный терминал курьера</div>
                        </div>
                      </div>
                      {paymentMethod === "card_on_delivery" && <CheckCircle2 size={18} color="var(--accent-cyan)" />}
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Confirmation Sidebar */}
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
                  Ваш заказ ({totalCount} шт.)
                </h3>

                {/* Items Mini List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "240px", overflowY: "auto" }}>
                  {items.map((item) => (
                    <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                        <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{item.quantity}×</span>
                        <span style={{ color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600, color: "#FFF", flexShrink: 0 }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", padding: "1rem 0", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Стоимость товаров</span>
                    <span style={{ color: "#FFF", fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Доставка</span>
                    <span style={{ color: deliveryFee === 0 ? "var(--color-success)" : "#FFF", fontWeight: 600 }}>
                      {deliveryFee === 0 ? "Бесплатно" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "#FFF" }}>К оплате:</span>
                  <span className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  style={{ width: "100%" }}
                >
                  Подтвердить и заказать
                </Button>

                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
                  Нажимая кнопку «Подтвердить», вы соглашаетесь с условиями публичной оферты и обработки персональных данных.
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

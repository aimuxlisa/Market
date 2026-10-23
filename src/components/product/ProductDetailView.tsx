"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";

interface ProductDetailViewProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    sku: string;
    description: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    rating: number;
    reviewsCount: number;
    isNew: boolean;
    isFeatured: boolean;
    images: { id: string; url: string; alt: string | null }[];
    attributes: { id: string; key: string; value: string }[];
  };
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const images = product.images.length > 0
    ? product.images.map((img) => img.url)
    : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop"];

  const currentImage = images[selectedImageIndex] || images[0];

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const installment12 = Math.round(product.price / 12);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: product.price,
      imageUrl: currentImage,
      stock: product.stock,
    }, quantity);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "3rem",
        marginBottom: "4rem",
      }}
    >
      {/* Left Column: Image Gallery */}
      <div>
        {/* Main Preview Container */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            marginBottom: "1rem",
            boxShadow: "0 0 30px rgba(0, 229, 255, 0.08)",
          }}
        >
          {/* Discount & Status Badges */}
          <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 2 }}>
            {discountPercent && <Badge variant="coral">-{discountPercent}%</Badge>}
            {product.isNew && <Badge variant="cyan">New</Badge>}
            {product.isFeatured && !discountPercent && <Badge variant="purple">Хит продаж</Badge>}
          </div>

          <img
            src={currentImage}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transition: "transform var(--transition-normal)",
            }}
          />
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${selectedImageIndex === idx ? "var(--accent-cyan)" : "var(--border-card)"}`,
                  background: "var(--bg-card)",
                  overflow: "hidden",
                  padding: "0.35rem",
                  cursor: "pointer",
                  transition: "border-color var(--transition-fast)",
                }}
              >
                <img
                  src={imgUrl}
                  alt={`thumbnail-${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Overview & Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Brand, SKU and Stock */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: "var(--accent-cyan)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {product.brand}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
              Арт: {product.sku}
            </span>
          </div>

          {product.stock > 0 ? (
            <span style={{ color: "var(--color-success)", fontSize: "0.8125rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)" }} />
              В наличии ({product.stock} шт.)
            </span>
          ) : (
            <span style={{ color: "var(--color-danger)", fontSize: "0.8125rem", fontWeight: 600 }}>
              Под заказ
            </span>
          )}
        </div>

        {/* Product Title */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2.15rem)",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.25,
          }}
        >
          {product.name}
        </h1>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#F59E0B" }}>
            <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
            <span style={{ fontWeight: 700 }}>{product.rating.toFixed(1)}</span>
          </div>
          <span style={{ color: "var(--text-muted)" }}>
            ({product.reviewsCount} отзывов покупателей)
          </span>
        </div>

        {/* Price Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.75rem" }}>
            <span
              className="font-display"
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#FFFFFF",
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span style={{ fontSize: "1.125rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Installment calculation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(0, 229, 255, 0.08)",
              border: "1px solid rgba(0, 229, 255, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "0.65rem 1rem",
              fontSize: "0.875rem",
              color: "var(--accent-cyan)",
            }}
          >
            <CreditCard size={18} />
            <span>
              В рассрочку: от <strong>{formatPrice(installment12)} / мес</strong> на 12 месяцев
            </span>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {/* Quantity Selector */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              padding: "0.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: quantity <= 1 ? "var(--text-muted)" : "var(--text-primary)",
              }}
              aria-label="Уменьшить количество"
            >
              <Minus size={16} />
            </button>
            <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: "0.9375rem" }}>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: quantity >= product.stock ? "var(--text-muted)" : "var(--text-primary)",
              }}
              aria-label="Увеличить количество"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            leftIcon={addedToCart ? <Check size={20} /> : <ShoppingBag size={20} />}
            style={{
              flex: 1,
              minWidth: "200px",
              background: addedToCart ? "var(--color-success)" : undefined,
              borderColor: addedToCart ? "var(--color-success)" : undefined,
            }}
          >
            {addedToCart ? "Добавлено в корзину!" : "Добавить в корзину"}
          </Button>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            className="btn-icon"
            onClick={() => setIsFavorite(!isFavorite)}
            style={{
              width: 50,
              height: 50,
              color: isFavorite ? "var(--accent-coral)" : undefined,
              borderColor: isFavorite ? "var(--accent-coral)" : undefined,
              background: isFavorite ? "rgba(255, 77, 77, 0.15)" : undefined,
            }}
            aria-label="В избранное"
          >
            <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Guarantee and Delivery Perks */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
              <Truck size={18} />
            </div>
            <div>
              <strong style={{ color: "#FFF" }}>Бесплатная доставка по Ташкенту</strong>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>При заказе от 500 000 сум</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(138, 43, 226, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-violet)" }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong style={{ color: "#FFF" }}>Официальная гарантия 2 года</strong>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>Гарантийное обслуживание в авторизованных СЦ</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(255, 77, 77, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-coral)" }}>
              <RotateCcw size={18} />
            </div>
            <div>
              <strong style={{ color: "#FFF" }}>Возврат и обмен без проблем</strong>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>14 дней с момента получения заказа</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

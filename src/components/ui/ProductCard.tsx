"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Check, Cpu, HardDrive, Monitor, ShieldCheck, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Badge } from "./Badge";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  brand,
  price,
  oldPrice,
  rating = 5.0,
  reviewsCount = 0,
  imageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
  isNew,
  isFeatured,
  stock = 1,
  onAddToCart,
  onToggleFavorite,
  isFavorite: propIsFavorite,
}) => {
  const { addToCart } = useCart();
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();
  const isFav = propIsFavorite !== undefined ? propIsFavorite : checkIsFavorite(id);
  const [added, setAdded] = useState(false);

  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  // Derive clean tech specs from name
  const lowerName = name.toLowerCase();
  let spec1 = "Флагман";
  let spec2 = "Официал";
  let spec3 = "В наличии";

  if (lowerName.includes("iphone") || lowerName.includes("galaxy") || lowerName.includes("xiaomi") || lowerName.includes("смартфон")) {
    spec1 = lowerName.includes("512") ? "512 GB" : lowerName.includes("1tb") ? "1 TB" : "256 GB";
    spec2 = lowerName.includes("ultra") || lowerName.includes("pro") ? "OLED 120Hz" : "OLED";
    spec3 = "5G";
  } else if (lowerName.includes("macbook") || lowerName.includes("ноутбук") || lowerName.includes("laptop")) {
    spec1 = lowerName.includes("m4") ? "M4 Pro" : "Intel i9";
    spec2 = lowerName.includes("36gb") ? "36 GB" : lowerName.includes("24gb") ? "24 GB" : "16 GB";
    spec3 = "Retina";
  } else if (lowerName.includes("tv") || lowerName.includes("телевизор")) {
    spec1 = "4K OLED";
    spec2 = "120Hz";
    spec3 = "Smart TV";
  } else if (lowerName.includes("playstation") || lowerName.includes("ps5") || lowerName.includes("xbox")) {
    spec1 = "4K 120fps";
    spec2 = "Ray Tracing";
    spec3 = "2 TB SSD";
  } else if (lowerName.includes("airpods") || lowerName.includes("наушники") || lowerName.includes("sony wh") || lowerName.includes("audio")) {
    spec1 = "Active ANC";
    spec2 = "Hi-Res";
    spec3 = "30ч";
  } else if (lowerName.includes("dyson") || lowerName.includes("пылесос") || lowerName.includes("фен")) {
    spec1 = "Digital V9";
    spec2 = "Ионизация";
    spec3 = "Премиум";
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id,
      name,
      slug,
      brand,
      price,
      oldPrice,
      rating,
      reviewsCount,
      imageUrl,
      stock,
    });
    if (onToggleFavorite) onToggleFavorite(id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    addToCart({ id, name, slug, brand, price, imageUrl, stock }, 1);
    if (onAddToCart) onAddToCart(id);
  };

  return (
    <article
      style={{
        background: "rgba(13, 19, 31, 0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
      className="property-card-hover"
    >
      {/* Top Single Minimal Badge */}
      <div
        style={{
          position: "absolute",
          top: "0.85rem",
          left: "0.85rem",
          zIndex: 3,
        }}
      >
        {discountPercent ? (
          <span
            style={{
              background: "rgba(194, 155, 99, 0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(194, 155, 99, 0.45)",
              color: "#DFC5A0",
              fontSize: "0.6875rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
            }}
          >
            -{discountPercent}%
          </span>
        ) : isNew ? (
          <span
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              fontSize: "0.6875rem",
              fontWeight: 600,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              letterSpacing: "0.05em",
            }}
          >
            NEW
          </span>
        ) : isFeatured ? (
          <span
            style={{
              background: "rgba(14, 20, 32, 0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(194, 155, 99, 0.3)",
              color: "#DFC5A0",
              fontSize: "0.6875rem",
              fontWeight: 600,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              letterSpacing: "0.05em",
            }}
          >
            ХИТ
          </span>
        ) : null}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        aria-label="В избранное"
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "0.85rem",
          zIndex: 4,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(14, 20, 32, 0.65)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isFav ? "#C29B63" : "#CBD5E1",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onClick={handleFavoriteClick}
      >
        <Heart size={16} fill={isFav ? "#C29B63" : "none"} />
      </button>

      {/* Product Image Link */}
      <Link
        href={`/product/${slug}`}
        style={{
          display: "block",
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 11",
          overflow: "hidden",
          background: "rgba(6, 8, 13, 0.65)",
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "1.25rem",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className="property-card-img"
          loading="lazy"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(6, 8, 13, 0.15) 0%, transparent 40%, rgba(6, 8, 13, 0.4) 100%)",
            pointerEvents: "none",
          }}
        />
      </Link>

      {/* Body Details */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Brand */}
        <div
          style={{
            fontSize: "0.75rem",
            color: "#C29B63",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.35rem",
          }}
        >
          {brand}
        </div>

        {/* Title Link */}
        <Link href={`/product/${slug}`} title={name} style={{ textDecoration: "none", color: "inherit" }}>
          <h4
            style={{
              fontFamily: "var(--font-main)",
              fontSize: "0.975rem",
              color: "#FFFFFF",
              fontWeight: 600,
              lineHeight: 1.4,
              height: "2.8rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "0.75rem",
            }}
          >
            {name}
          </h4>
        </Link>

        {/* Specs Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: "1rem",
            color: "#8E9BAE",
            fontSize: "0.78125rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Cpu size={13} color="#C29B63" />
            <span>{spec1}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <HardDrive size={13} color="#C29B63" />
            <span>{spec2}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <ShieldCheck size={13} color="#C29B63" />
            <span>{spec3}</span>
          </div>
        </div>

        {/* Footer: Price & Add To Cart Button */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.4rem",
            gap: "0.5rem",
          }}
        >
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF" }}>
              {formatPrice(price)}
            </div>
            {oldPrice && oldPrice > price && (
              <div style={{ fontSize: "0.75rem", color: "#8E9BAE", textDecoration: "line-through" }}>
                {formatPrice(oldPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            aria-label={stock > 0 ? "Добавить в корзину" : "Нет в наличии"}
            title={stock > 0 ? "Добавить в корзину" : "Нет в наличии"}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: added
                ? "#10B981"
                : stock <= 0
                ? "rgba(255, 255, 255, 0.05)"
                : "#C29B63",
              color: added ? "#FFFFFF" : stock <= 0 ? "#8E9BAE" : "#06080D",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: stock > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              boxShadow: stock > 0 ? "0 4px 14px rgba(194, 155, 99, 0.25)" : "none",
              flexShrink: 0,
            }}
          >
            {added ? <Check size={17} /> : <ShoppingBag size={17} />}
          </button>
        </div>

      </div>
    </article>
  );
};

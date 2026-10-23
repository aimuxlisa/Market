"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
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
    setTimeout(() => setAdded(false), 1600);
    addToCart({ id, name, slug, brand, price, imageUrl, stock }, 1);
    if (onAddToCart) onAddToCart(id);
  };

  return (
    <article className="product-card">
      {/* Badges */}
      <div className="product-card-badges">
        {discountPercent && (
          <Badge variant="coral">-{discountPercent}%</Badge>
        )}
        {isNew && <Badge variant="cyan">New</Badge>}
        {isFeatured && !discountPercent && <Badge variant="purple">Топ</Badge>}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        aria-label="В избранное"
        className={`product-card-fav ${isFav ? "active" : ""}`}
        onClick={handleFavoriteClick}
      >
        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
      </button>

      {/* Image Wrap */}
      <Link href={`/product/${slug}`} className="product-card-image-wrap">
        <img
          src={imageUrl}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
      </Link>

      {/* Body */}
      <div className="product-card-body">
        <div className="product-card-brand">{brand}</div>
        <Link href={`/product/${slug}`} title={name}>
          <h4 className="product-card-title">{name}</h4>
        </Link>

        <div className="product-card-rating">
          <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
          <span style={{ fontWeight: 700 }}>{rating.toFixed(1)}</span>
          <span className="product-card-rating-count">({reviewsCount})</span>
        </div>

        {/* Footer */}
        <div className="product-card-footer">
          <div className="product-card-prices">
            <span className="product-card-price">{formatPrice(price)}</span>
            {oldPrice && oldPrice > price && (
              <span className="product-card-old-price">{formatPrice(oldPrice)}</span>
            )}
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            title={stock > 0 ? "В корзину" : "Нет в наличии"}
            style={{
              background: added ? "var(--color-success)" : undefined,
              color: added ? "#FFF" : undefined,
              borderColor: added ? "var(--color-success)" : undefined,
            }}
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
};

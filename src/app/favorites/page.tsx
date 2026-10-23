"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useFavorites } from "@/context/FavoritesContext";
import { ChevronRight, Heart, Trash2 } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

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
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Избранное</span>
          </nav>

          {/* Page Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Heart size={28} color="var(--accent-coral)" fill="var(--accent-coral)" />
                Избранное
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: "0.25rem" }}>
                {favorites.length === 0
                  ? "У вас пока нет сохранённых товаров"
                  : `Сохранено товаров: ${favorites.length}`}
              </p>
            </div>

            {favorites.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFavorites}
                leftIcon={<Trash2 size={16} />}
                style={{ color: "var(--accent-coral)" }}
              >
                Очистить список
              </Button>
            )}
          </div>

          {/* Content */}
          {favorites.length === 0 ? (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-xl)",
                padding: "3rem 1.5rem",
              }}
            >
              <EmptyState
                icon={<Heart size={44} color="var(--accent-coral)" />}
                title="В избранном пока пусто"
                description="Добавляйте понравившиеся смартфоны, ноутбуки и другую технику, нажимая на иконку сердечка на карточке товара."
                actionText="Перейти в каталог"
                actionHref="/catalog"
              />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {favorites.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  brand={product.brand}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                  imageUrl={product.imageUrl}
                  stock={product.stock}
                  isFavorite={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTelegram } from "@/context/TelegramContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ShoppingBag,
  Send,
  Zap,
  Search,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface ProductItem {
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
  categoryId?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function TelegramMiniAppPage() {
  const { isTelegram, tgUser, haptic } = useTelegram();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "1.25rem 0 5rem" }}>
        <div className="container">
          {/* Telegram Header Welcome Card */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: "var(--radius-lg)",
              background:
                "linear-gradient(135deg, rgba(194, 155, 99, 0.12) 0%, rgba(10, 14, 22, 0.85) 100%)",
              border: "1px solid rgba(194, 155, 99, 0.25)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  background: "rgba(0, 136, 204, 0.2)",
                  border: "1px solid rgba(0, 136, 204, 0.35)",
                  color: "#38B2AC",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                <Send size={13} />
                <span>TELEGRAM MINI APP</span>
              </div>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {tgUser ? `Здравствуйте, ${tgUser.first_name}!` : "HAVEN ELECTRONICS STORE"}
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  marginTop: "0.35rem",
                  margin: 0,
                }}
              >
                Официальный каталог премиальной техники с доставкой по Узбекистану
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href="/cart">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ShoppingBag size={15} />}
                  onClick={() => haptic("light")}
                >
                  Корзина
                </Button>
              </Link>
            </div>
          </div>

          {/* Search bar inside mini app */}
          <div style={{ marginBottom: "1.5rem", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Поиск смартфонов, MacBook, PlayStation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem 0.85rem 2.75rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(14, 19, 30, 0.8)",
                border: "1px solid var(--border-subtle)",
                color: "#FFFFFF",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          {/* Categories Pill Selector */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.75rem",
              marginBottom: "1.75rem",
              scrollbarWidth: "none",
            }}
          >
            <button
              onClick={() => {
                setSelectedCategory("all");
                haptic("light");
              }}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
                background:
                  selectedCategory === "all"
                    ? "var(--accent-gold)"
                    : "rgba(255, 255, 255, 0.05)",
                color: selectedCategory === "all" ? "#07090E" : "#CBD5E1",
                border:
                  selectedCategory === "all"
                    ? "1px solid var(--accent-gold)"
                    : "1px solid var(--border-subtle)",
                transition: "all 0.2s ease",
              }}
            >
              Все товары ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  haptic("light");
                }}
                style={{
                  padding: "0.55rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  background:
                    selectedCategory === cat.id
                      ? "var(--accent-gold)"
                      : "rgba(255, 255, 255, 0.05)",
                  color: selectedCategory === cat.id ? "#07090E" : "#CBD5E1",
                  border:
                    selectedCategory === cat.id
                      ? "1px solid var(--accent-gold)"
                      : "1px solid var(--border-subtle)",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div
              style={{
                padding: "4rem 0",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              Загрузка товаров каталога...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "3.5rem 1rem",
                textAlign: "center",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginBottom: "0.5rem",
                }}
              >
                Товары не найдены
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Попробуйте изменить поисковый запрос или выбрать другую категорию.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

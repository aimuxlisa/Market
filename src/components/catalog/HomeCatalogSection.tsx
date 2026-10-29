"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Filter } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

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

interface HomeCatalogSectionProps {
  products: ProductItem[];
  categories: CategoryItem[];
}

export const HomeCatalogSection: React.FC<HomeCatalogSectionProps> = ({
  products,
  categories,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

  return (
    <section style={{ padding: "3rem 0 5rem", position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                color: "#C29B63",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: "0.5rem",
              }}
            >
              КАТАЛОГ
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.85rem, 3vw, 2.4rem)",
                lineHeight: 1.2,
                color: "#FFFFFF",
                fontWeight: 400,
              }}
            >
              Все товары
            </h2>
          </div>

          <Link
            href="/catalog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "#DFC5A0",
              fontSize: "0.9375rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <span>В каталог</span>
            <ArrowRight size={15} color="#C29B63" />
          </Link>
        </div>

        {/* Category Pill Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            style={{
              padding: "0.6rem 1.35rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: activeCategory === "all" ? "1px solid #C29B63" : "1px solid rgba(255, 255, 255, 0.1)",
              background: activeCategory === "all" ? "#C29B63" : "rgba(255, 255, 255, 0.04)",
              color: activeCategory === "all" ? "#06080D" : "#CBD5E1",
              whiteSpace: "nowrap",
            }}
          >
            Все товары ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "0.6rem 1.35rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: isActive ? "1px solid #C29B63" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isActive ? "#C29B63" : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "#06080D" : "#CBD5E1",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              slug={item.slug}
              brand={item.brand}
              price={item.price}
              oldPrice={item.oldPrice}
              rating={item.rating}
              reviewsCount={item.reviewsCount}
              imageUrl={item.imageUrl}
              isNew={item.isNew}
              isFeatured={item.isFeatured}
              stock={item.stock}
            />
          ))}
        </div>

      </div>
    </section>
  );
};


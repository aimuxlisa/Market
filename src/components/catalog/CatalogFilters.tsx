"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CatalogFiltersProps {
  categories: { id: string; name: string; slug: string; _count?: { products: number } }[];
  brands: string[];
  currentCategorySlug?: string;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categories,
  brands,
  currentCategorySlug,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBrands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const inStockOnly = searchParams.get("inStock") === "true";

  const [localMinPrice, setLocalMinPrice] = useState(minPriceParam);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceParam);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const basePath = currentCategorySlug ? `/catalog/${currentCategorySlug}` : "/catalog";
    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  };

  const handleBrandToggle = (brand: string) => {
    let newBrands: string[];
    if (selectedBrands.includes(brand)) {
      newBrands = selectedBrands.filter((b) => b !== brand);
    } else {
      newBrands = [...selectedBrands, brand];
    }
    updateFilters({
      brands: newBrands.length > 0 ? newBrands.join(",") : null,
    });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: localMinPrice || null,
      maxPrice: localMaxPrice || null,
    });
  };

  const handleStockToggle = () => {
    updateFilters({
      inStock: inStockOnly ? null : "true",
    });
  };

  const handleResetFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    const basePath = currentCategorySlug ? `/catalog/${currentCategorySlug}` : "/catalog";
    router.push(basePath);
  };

  const filterContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Category Links */}
      <div>
        <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#FFF", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Категории
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <Link
            href="/catalog"
            style={{
              padding: "0.45rem 0.65rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              color: !currentCategorySlug ? "var(--accent-cyan)" : "var(--text-secondary)",
              background: !currentCategorySlug ? "var(--bg-surface)" : "transparent",
              fontWeight: !currentCategorySlug ? 700 : 500,
            }}
          >
            Все категории
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog/${cat.slug}`}
              style={{
                padding: "0.45rem 0.65rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                color: currentCategorySlug === cat.slug ? "var(--accent-cyan)" : "var(--text-secondary)",
                background: currentCategorySlug === cat.slug ? "var(--bg-surface)" : "transparent",
                fontWeight: currentCategorySlug === cat.slug ? 700 : 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{cat.name}</span>
              {cat._count?.products !== undefined && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {cat._count.products}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#FFF", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Цена (UZS)
        </h4>
        <form onSubmit={handlePriceApply} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              placeholder="От"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="input"
              style={{ fontSize: "0.8125rem", padding: "0.5rem 0.75rem" }}
            />
            <input
              type="number"
              placeholder="До"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="input"
              style={{ fontSize: "0.8125rem", padding: "0.5rem 0.75rem" }}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Применить
          </Button>
        </form>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#FFF", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Бренды
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "220px", overflowY: "auto" }}>
            {brands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    color: isChecked ? "#FFF" : "var(--text-secondary)",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `1.5px solid ${isChecked ? "var(--accent-cyan)" : "var(--border-card)"}`,
                      background: isChecked ? "var(--accent-cyan)" : "var(--bg-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-inverse)",
                      transition: "all var(--transition-fast)",
                    }}
                    onClick={() => handleBrandToggle(brand)}
                  >
                    {isChecked && <Check size={13} strokeWidth={3} />}
                  </div>
                  <span onClick={() => handleBrandToggle(brand)}>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* In Stock Only */}
      <div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: inStockOnly ? "var(--accent-cyan)" : "var(--text-secondary)",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: `1.5px solid ${inStockOnly ? "var(--accent-cyan)" : "var(--border-card)"}`,
              background: inStockOnly ? "var(--accent-cyan)" : "var(--bg-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-inverse)",
            }}
            onClick={handleStockToggle}
          >
            {inStockOnly && <Check size={13} strokeWidth={3} />}
          </div>
          <span onClick={handleStockToggle}>Только в наличии</span>
        </label>
      </div>

      {/* Reset Button */}
      {(selectedBrands.length > 0 || minPriceParam || maxPriceParam || inStockOnly) && (
        <Button variant="ghost" size="sm" onClick={handleResetFilters} style={{ color: "var(--accent-coral)" }}>
          Сбросить все фильтры
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem",
          alignSelf: "flex-start",
        }}
        className="hide-mobile"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-subtle)" }}>
          <Filter size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#FFF" }}>
            Фильтры
          </h3>
        </div>
        {filterContent}
      </aside>

      {/* Mobile Drawer Filter Trigger Button */}
      <div
        className="mobile-only-filter-btn"
        style={{ display: "none", marginBottom: "1rem" }}
      >
        <Button
          variant="secondary"
          size="md"
          leftIcon={<Filter size={18} />}
          onClick={() => setMobileDrawerOpen(true)}
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <span>Фильтры и категории</span>
          {(selectedBrands.length > 0 || minPriceParam || maxPriceParam || inStockOnly) && (
            <span style={{ background: "var(--accent-coral)", color: "#FFF", borderRadius: "50%", width: 20, height: 20, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              !
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(4, 7, 14, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            style={{
              width: "85%",
              maxWidth: "340px",
              height: "100%",
              background: "var(--bg-secondary)",
              borderLeft: "1px solid var(--border-card)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Filter size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#FFF" }}>
                  Фильтры
                </h3>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
};

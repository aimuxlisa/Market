"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Play,
  Search,
  Cpu,
  HardDrive,
  Monitor,
  ShoppingBag,
  Check,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  imageUrl?: string;
  stock: number;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface HomeHeroSectionProps {
  flagship: ProductItem;
  categories: CategoryItem[];
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  flagship,
  categories,
}) => {
  const { addToCart } = useCart();
  const [videoOpen, setVideoOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Search filter bar states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const handleAddFlagshipToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (flagship.stock <= 0) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    addToCart(
      {
        id: flagship.id,
        name: flagship.name,
        slug: flagship.slug,
        brand: flagship.brand,
        price: flagship.price,
        imageUrl: flagship.imageUrl,
        stock: flagship.stock,
      },
      1
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (selectedPrice !== "all") {
      const [min, max] = selectedPrice.split("-");
      if (min) params.set("minPrice", min);
      if (max && max !== "+") params.set("maxPrice", max);
    }
    window.location.href = `/catalog?${params.toString()}`;
  };

  return (
    <>
      {/* =========================================================================
          HERO SECTION: High-End Architecture at Twilight with Floating Glass Card
          ========================================================================= */}
      <section
        style={{
          position: "relative",
          minHeight: "86vh",
          display: "flex",
          alignItems: "center",
          padding: "5rem 0 6.5rem",
          backgroundImage: `linear-gradient(180deg, rgba(6, 8, 13, 0.58) 0%, rgba(6, 8, 13, 0.82) 55%, #06080D 100%), url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=85&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "50vw",
            height: "50vh",
            background: "radial-gradient(circle, rgba(194, 155, 99, 0.09) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              alignItems: "center",
              gap: "3rem",
            }}
            className="hero-grid-responsive"
          >
            {/* Left Column: Editorial Headline & Actions */}
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  color: "#C29B63",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  display: "inline-block",
                  marginBottom: "1.25rem",
                }}
              >
                ФЛАГМАНСКАЯ ТЕХНИКА
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.75rem, 5.2vw, 4.85rem)",
                  lineHeight: 1.08,
                  fontWeight: 400,
                  color: "#FFFFFF",
                  letterSpacing: "-0.015em",
                  marginBottom: "1.5rem",
                }}
              >
                Создай своё<br />
                пространство<br />
                для жизни.
              </h1>

              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  color: "#94A3B8",
                  maxWidth: "460px",
                  marginBottom: "2.5rem",
                  fontWeight: 300,
                }}
              >
                Официальные флагманы мировых брендов в Ташкенте с гарантией до 2 лет.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Primary CTA Button */}
                <Link href="/catalog">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      background: "#C29B63",
                      color: "#0B0F17",
                      padding: "0.85rem 1.85rem",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      boxShadow: "0 8px 24px rgba(194, 155, 99, 0.35)",
                    }}
                  >
                    <span>В каталог</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>

                {/* Secondary Video Button */}
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "transparent",
                    color: "#FFFFFF",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    padding: "0.5rem 0.75rem",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#DFC5A0")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                >
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Play size={14} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: 2 }} />
                  </span>
                  <span>Видео</span>
                </button>
              </div>
            </div>

            {/* Right Column: Floating Glassmorphic Exclusive Tech Card */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  background: "rgba(14, 20, 32, 0.55)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "2rem",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(194, 155, 99, 0.12)",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.2em",
                    color: "#C29B63",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  ЭКСКЛЮЗИВ
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.65rem",
                    color: "#FFFFFF",
                    fontWeight: 500,
                    marginBottom: "0.4rem",
                    lineHeight: 1.25,
                  }}
                >
                  {flagship.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "#94A3B8",
                    fontSize: "0.875rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <MapPin size={14} color="#C29B63" />
                  <span>Ташкент · В наличии</span>
                </div>

                {/* Specs Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.75rem",
                    padding: "0.85rem 0",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <Cpu size={15} color="#C29B63" />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFFFFF" }}>Apple M4</div>
                      <div style={{ fontSize: "0.6875rem", color: "#8E9BAE" }}>Чип</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <HardDrive size={15} color="#C29B63" />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFFFFF" }}>1 TB</div>
                      <div style={{ fontSize: "0.6875rem", color: "#8E9BAE" }}>Память</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <Monitor size={15} color="#C29B63" />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFFFFF" }}>Retina XDR</div>
                      <div style={{ fontSize: "0.6875rem", color: "#8E9BAE" }}>Экран</div>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                      {formatPrice(flagship.price)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#8E9BAE" }}>
                      В наличии
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <button
                      type="button"
                      onClick={handleAddFlagshipToCart}
                      aria-label="Добавить в корзину"
                      title="Добавить в корзину"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: added ? "#10B981" : "#C29B63",
                        color: added ? "#FFFFFF" : "#06080D",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 14px rgba(194, 155, 99, 0.25)",
                      }}
                    >
                      {added ? <Check size={17} /> : <ShoppingBag size={17} />}
                    </button>

                    <Link
                      href={`/product/${flagship.slug}`}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        border: "1px solid rgba(194, 155, 99, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(194, 155, 99, 0.1)",
                        color: "#DFC5A0",
                        textDecoration: "none",
                      }}
                      title="Подробнее о товаре"
                    >
                      <ArrowRight size={14} color="#C29B63" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLOATING SEARCH FILTER BAR: Category / Brand / Price in UZS
          ========================================================================= */}
      <section style={{ marginTop: "-2.25rem", position: "relative", zIndex: 10, padding: "0 1.25rem" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              background: "rgba(13, 19, 31, 0.88)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "20px",
              padding: "0.85rem 1rem",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.4)",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr auto",
              alignItems: "center",
              gap: "1rem",
            }}
            className="search-filter-grid-responsive"
          >
            {/* Category Select */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.5rem 0.85rem",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C29B63",
                  flexShrink: 0,
                }}
              >
                <Search size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.1em",
                    color: "#8E9BAE",
                    textTransform: "uppercase",
                    display: "block",
                    fontWeight: 600,
                  }}
                >
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    outline: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <option value="all" style={{ background: "#0E1422" }}>Все категории</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug} style={{ background: "#0E1422" }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brand Select */}
            <div
              style={{
                padding: "0.5rem 0.85rem",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <label
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  color: "#8E9BAE",
                  textTransform: "uppercase",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                Бренд
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  outline: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <option value="all" style={{ background: "#0E1422" }}>Все бренды</option>
                <option value="Apple" style={{ background: "#0E1422" }}>Apple</option>
                <option value="Samsung" style={{ background: "#0E1422" }}>Samsung</option>
                <option value="Sony" style={{ background: "#0E1422" }}>Sony</option>
                <option value="Dyson" style={{ background: "#0E1422" }}>Dyson</option>
                <option value="Xiaomi" style={{ background: "#0E1422" }}>Xiaomi</option>
                <option value="ASUS" style={{ background: "#0E1422" }}>ASUS</option>
                <option value="LG" style={{ background: "#0E1422" }}>LG</option>
              </select>
            </div>

            {/* Price Range Select in UZS */}
            <div style={{ padding: "0.5rem 0.85rem" }}>
              <label
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  color: "#8E9BAE",
                  textTransform: "uppercase",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                Цена (сум)
              </label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  outline: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <option value="all" style={{ background: "#0E1422" }}>Любая цена</option>
                <option value="0-5000000" style={{ background: "#0E1422" }}>До 5 000 000 сум</option>
                <option value="5000000-15000000" style={{ background: "#0E1422" }}>5 000 000 – 15 000 000 сум</option>
                <option value="15000000-30000000" style={{ background: "#0E1422" }}>15 000 000 – 30 000 000 сум</option>
                <option value="30000000+" style={{ background: "#0E1422" }}>От 30 000 000 сум</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  background: "#C29B63",
                  color: "#0B0F17",
                  borderRadius: "9999px",
                  padding: "0.85rem 1.75rem",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  boxShadow: "0 4px 18px rgba(194, 155, 99, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <span>Найти технику</span>
                <Search size={15} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "rgba(4, 6, 10, 0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setVideoOpen(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "880px",
              aspectRatio: "16 / 9",
              background: "#000000",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(194, 155, 99, 0.3)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 10,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.7)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Vb8T9VvS1aY?autoplay=1"
              title="Флагманские технологии Haven Electronics"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
};


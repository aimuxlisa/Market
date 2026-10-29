"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
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
}

interface FeaturedCarouselProps {
  products: ProductItem[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products }) => {
  // Items per page
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 992) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1200) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = prev + itemsPerPage;
      return next > maxIndex ? 0 : next;
    });
  };

  const handleDotClick = (pageIndex: number) => {
    const target = Math.min(pageIndex * itemsPerPage, maxIndex);
    setCurrentIndex(target);
  };

  const currentPage = Math.min(Math.floor(currentIndex / itemsPerPage), totalPages - 1);

  if (products.length === 0) return null;

  return (
    <section style={{ padding: "5.5rem 0 5rem", position: "relative" }}>
      {/* Background Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2.75rem",
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
              ФЛАГМАНЫ
            </span>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3.4vw, 2.75rem)",
                lineHeight: 1.15,
                color: "#FFFFFF",
                fontWeight: 400,
                letterSpacing: "-0.015em",
              }}
            >
              Исключительные технологии.
            </h2>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
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
                transition: "color 0.2s ease",
              }}
            >
              <span>Все новинки</span>
              <ArrowRight size={15} color="#C29B63" />
            </Link>

            {/* Carousel Arrow Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Предыдущие товары"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: currentIndex === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.06)",
                  border: currentIndex === 0 ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(194, 155, 99, 0.35)",
                  color: currentIndex === 0 ? "#475569" : "#DFC5A0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Следующие товары"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "rgba(194, 155, 99, 0.15)",
                  border: "1px solid rgba(194, 155, 99, 0.5)",
                  color: "#DFC5A0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div style={{ overflow: "hidden", position: "relative", width: "100%", padding: "0.75rem 0.25rem" }}>
          <div
            ref={containerRef}
            style={{
              display: "flex",
              gap: "1.5rem",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: `translateX(calc(-${currentIndex} * (100% + 1.5rem) / ${itemsPerPage}))`,
            }}
          >
            {products.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: `0 0 calc(${100 / itemsPerPage}% - ${(1.5 * (itemsPerPage - 1)) / itemsPerPage}rem)`,
                  minWidth: 0,
                }}
              >
                <ProductCard
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
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Pagination Dots (matching the photo layout: elongated active gold pill + subtle dots) */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              marginTop: "2.75rem",
            }}
          >
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentPage;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Перейти к слайду ${idx + 1}`}
                  style={{
                    width: isActive ? 34 : 8,
                    height: 5,
                    borderRadius: "9999px",
                    background: isActive
                      ? "linear-gradient(90deg, #F3E3B6 0%, #D4AF37 100%)"
                      : "rgba(255, 255, 255, 0.18)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive ? "0 0 12px rgba(212, 175, 55, 0.55)" : "none",
                  }}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};


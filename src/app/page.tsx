import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { FeaturedCarousel } from "@/components/catalog/FeaturedCarousel";
import { HomeCatalogSection } from "@/components/catalog/HomeCatalogSection";
import { prisma } from "@/lib/prisma";
import { Gem, Zap, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real data from Prisma
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let allProducts: Array<{
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
    stock: number;
    categoryId?: string;
  }> = [];

  try {
    const [dbCategories, dbProducts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: 46,
      }),
    ]);

    categories = dbCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

    allProducts = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      price: p.price,
      oldPrice: p.oldPrice,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      imageUrl: p.images[0]?.url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      stock: p.stock,
      categoryId: p.categoryId,
    }));
  } catch (error) {
    console.error("Database query failed on HomePage:", error);
  }

  // Fallback flagship product if database empty
  const defaultFlagship = {
    id: "flagship-1",
    name: "MacBook Pro 16\" M4 Max 36GB / 1TB Space Black",
    slug: "macbook-pro-14-m4-pro-24gb-512gb-space-black",
    brand: "Apple",
    price: 39900000,
    oldPrice: 42000000,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop",
    stock: 8,
  };

  const flagshipProduct =
    allProducts.find((p) => p.isFeatured && p.brand === "Apple") ||
    allProducts[0] ||
    defaultFlagship;

  // Curated list for the carousel (featured and top items, at least 12 products)
  const carouselProducts =
    allProducts.length > 0
      ? allProducts.slice(0, 16)
      : [
          defaultFlagship,
          {
            id: "tech-2",
            name: "iPhone 16 Pro Max 256GB Desert Titanium",
            slug: "iphone-16-pro-max-256gb-desert-titanium",
            brand: "Apple",
            price: 16490000,
            oldPrice: 17990000,
            imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&fit=crop",
            stock: 12,
            isFeatured: true,
          },
          {
            id: "tech-3",
            name: "Samsung Galaxy S25 Ultra 512GB Titanium Black",
            slug: "samsung-galaxy-s25-ultra-512gb-titanium-black",
            brand: "Samsung",
            price: 15890000,
            oldPrice: 16990000,
            imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&fit=crop",
            stock: 15,
            isNew: true,
          },
          {
            id: "tech-4",
            name: "Sony PlayStation 5 Pro 2TB White Edition",
            slug: "sony-playstation-5-pro-2tb",
            brand: "Sony",
            price: 11200000,
            oldPrice: 12500000,
            imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&fit=crop",
            stock: 6,
            isNew: true,
          },
        ];

  return (
    <>
      <Header />

      <main className="main-content" style={{ overflow: "hidden" }}>
        
        {/* 1. HERO SECTION & FLOATING SEARCH BAR (from photo reference) */}
        <HomeHeroSection
          flagship={flagshipProduct}
          categories={categories}
        />

        {/* 2. INTERACTIVE FEATURED CAROUSEL / SLIDER (from photo reference) */}
        <FeaturedCarousel products={carouselProducts} />

        {/* 3. FULL TECH CATALOG SECTION ("больше товара") */}
        {allProducts.length > 0 && (
          <HomeCatalogSection
            products={allProducts}
            categories={categories}
          />
        )}

        {/* 4. VALUE PROPOSITION CARDS (4 Columns matching Haven photo layout) */}
        <section style={{ padding: "3rem 0 6rem" }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {/* Card 1: Official Warranty */}
              <div
                style={{
                  background: "rgba(13, 19, 31, 0.65)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                className="value-card-hover"
              >
                <div style={{ color: "#C29B63", marginBottom: "1.5rem" }}>
                  <Gem size={26} />
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-main)",
                    fontSize: "1.15rem",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  Официальная гарантия
                </h4>
                <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                  До 24 месяцев авторизованной поддержки на всю технику.
                </p>
                <div style={{ marginTop: "auto" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#CBD5E1",
                      background: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Card 2: Express Delivery */}
              <div
                style={{
                  background: "rgba(13, 19, 31, 0.65)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                className="value-card-hover"
              >
                <div style={{ color: "#C29B63", marginBottom: "1.5rem" }}>
                  <Zap size={26} />
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-main)",
                    fontSize: "1.15rem",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  Экспресс-доставка
                </h4>
                <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                  По Ташкенту от 2 часов и бережно по всему Узбекистану.
                </p>
                <div style={{ marginTop: "auto" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#CBD5E1",
                      background: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Card 3: 100% Original */}
              <div
                style={{
                  background: "rgba(13, 19, 31, 0.65)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                className="value-card-hover"
              >
                <div style={{ color: "#C29B63", marginBottom: "1.5rem" }}>
                  <ShieldCheck size={26} />
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-main)",
                    fontSize: "1.15rem",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  100% Оригинал
                </h4>
                <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                  Прямые поставки от официальных брендов в пломбах.
                </p>
                <div style={{ marginTop: "auto" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#CBD5E1",
                      background: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Card 4: Payment in UZS & Installments */}
              <div
                style={{
                  background: "rgba(13, 19, 31, 0.65)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                className="value-card-hover"
              >
                <div style={{ color: "#C29B63", marginBottom: "1.5rem" }}>
                  <CreditCard size={26} />
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-main)",
                    fontSize: "1.15rem",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  Оплата и рассрочка
                </h4>
                <p style={{ color: "#8E9BAE", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                  Uzcard, Humo, Visa и честная рассрочка 0% без переплат.
                </p>
                <div style={{ marginTop: "auto" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#CBD5E1",
                      background: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

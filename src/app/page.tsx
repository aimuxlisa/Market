import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  Smartphone,
  Laptop,
  Tv,
  Refrigerator,
  Gamepad2,
  Home as HomeIcon,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real data from Prisma with safe fallback
  type CategoryWithIcon = { id: string; name: string; slug: string; icon: string | null };
  type ProductWithImages = Prisma.ProductGetPayload<{
    include: { images: { orderBy: { sortOrder: "asc" }; take: 1 } };
  }>;
  type PromotionItem = Awaited<ReturnType<typeof prisma.promotion.findMany>>[number];

  let categories: CategoryWithIcon[] = [];
  let products: ProductWithImages[] = [];
  let promotions: PromotionItem[] = [];

  try {
    const results = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.promotion.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
    ]);
    categories = results[0];
    products = results[1];
    promotions = results[2];
  } catch (err) {
    console.error("Database connection error on HomePage:", err);
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    Smartphone: <Smartphone size={20} />,
    Laptop: <Laptop size={20} />,
    Tv: <Tv size={20} />,
    Refrigerator: <Refrigerator size={20} />,
    Gamepad2: <Gamepad2 size={20} />,
    Home: <HomeIcon size={20} />,
  };

  const heroPromo = promotions[0];
  const sidePromo1 = promotions[1];
  const sidePromo2 = promotions[2];

  return (
    <>
      <Header />

      <main className="main-content">
        {/* Bento Grid Hero Section */}
        <section style={{ padding: "2rem 0 3.5rem" }}>
          <div className="container">
            <div className="bento-grid">
              
              {/* Main Hero Card */}
              <div
                className="bento-item bento-hero"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(8, 8, 16, 0.94) 0%, rgba(14, 14, 28, 0.65) 100%), url(${heroPromo?.desktopImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=600&fit=crop"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "3rem 2.5rem",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div>
                  <div style={{ marginBottom: "1rem" }}>
                    <Badge variant="coral">
                      <Sparkles size={12} /> {heroPromo?.badge || "Флагманы 2026"}
                    </Badge>
                  </div>
                  <h1
                    style={{
                      fontSize: "clamp(2rem, 3.2vw, 3rem)",
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: "-0.025em",
                      maxWidth: "560px",
                      marginBottom: "1rem",
                      color: "#FFFFFF",
                    }}
                  >
                    {heroPromo?.title || "Флагманы 2026: Новая эра скорости"}
                  </h1>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "1.0625rem",
                      maxWidth: "480px",
                      lineHeight: 1.6,
                    }}
                  >
                    {heroPromo?.subtitle || "iPhone 16 Pro, Galaxy S25 и MacBook Pro M4 уже в наличии с официальной гарантией."}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
                  <Link href={heroPromo?.href || "/catalog/smartphones"}>
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                      Перейти в каталог
                    </Button>
                  </Link>
                  <Link href="/catalog">
                    <Button variant="secondary" size="lg">
                      Все спецпредложения
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Side Card 1 */}
              <div
                className="bento-item bento-side-1"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.65) 100%), url(${sidePromo1?.desktopImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "1.75rem",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Badge variant="purple">{sidePromo1?.badge || "Выгода до 15%"}</Badge>
                  <h3
                    style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.75rem", color: "#FFF", letterSpacing: "-0.015em" }}
                  >
                    {sidePromo1?.title || "MacBook & Pro Laptops"}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
                    {sidePromo1?.subtitle || "Для дизайнеров, разработчиков и креаторов"}
                  </p>
                </div>
                <div>
                  <Link href={sidePromo1?.href || "/catalog/laptops"}>
                    <Button variant="cyan" size="sm" rightIcon={<ArrowRight size={14} />}>
                      Смотреть
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Side Card 2 */}
              <div
                className="bento-item bento-side-2"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(12, 12, 24, 0.94) 0%, rgba(20, 20, 36, 0.65) 100%), url(${sidePromo2?.desktopImage || "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "1.75rem",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Badge variant="cyan">{sidePromo2?.badge || "Спецпредложение"}</Badge>
                  <h3
                    style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.75rem", color: "#FFF", letterSpacing: "-0.015em" }}
                  >
                    {sidePromo2?.title || "PlayStation 5 Slim Bundle"}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
                    {sidePromo2?.subtitle || "Второй геймпад в подарок к каждой консоли"}
                  </p>
                </div>
                <div>
                  <Link href={sidePromo2?.href || "/product/sony-playstation-5-slim-1tb-bundle"}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Categories Bar / Grid */}
        <section style={{ padding: "1.5rem 0 3rem" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#FFF", letterSpacing: "-0.015em" }}>
                Популярные категории
              </h2>
              <Link href="/catalog" style={{ color: "var(--accent-cyan)", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                Весь каталог <ArrowRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalog/${cat.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "1rem 1.25rem",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-lg)",
                    transition: "all var(--transition-fast)",
                  }}
                  className="category-pill"
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: "rgba(0, 229, 255, 0.08)",
                      border: "1px solid rgba(0, 229, 255, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-cyan)",
                    }}
                  >
                    {categoryIcons[cat.icon || ""] || <Smartphone size={20} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FFF" }}>
                      {cat.name}
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Перейти
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section style={{ padding: "1.5rem 0 4rem" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "2rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <Flame size={18} color="var(--accent-coral)" />
                  <span style={{ color: "var(--accent-coral)", fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Хиты продаж и новинки
                  </span>
                </div>
                <h2
                  style={{ fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)", fontWeight: 800, color: "#FFF", letterSpacing: "-0.02em" }}
                >
                  Рекомендуемые товары
                </h2>
              </div>

              <Link href="/catalog">
                <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Все товары ({products.length}+)
                </Button>
              </Link>
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  slug={prod.slug}
                  brand={prod.brand}
                  price={prod.price}
                  oldPrice={prod.oldPrice}
                  rating={prod.rating}
                  reviewsCount={prod.reviewsCount}
                  imageUrl={prod.images[0]?.url}
                  isNew={prod.isNew}
                  isFeatured={prod.isFeatured}
                  stock={prod.stock}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

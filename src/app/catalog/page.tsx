import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ChevronRight, PackageOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;
  const { brands, minPrice, maxPrice, inStock, sort } = resolvedParams;

  // Build Prisma where filter
  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
  };

  if (brands) {
    const brandList = brands.split(",").filter(Boolean);
    if (brandList.length > 0) {
      where.brand = { in: brandList };
    }
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice && !isNaN(Number(minPrice))) {
      where.price.gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      where.price.lte = Number(maxPrice);
    }
  }

  if (inStock === "true") {
    where.stock = { gt: 0 };
  }

  // Build Prisma orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "rating") {
    orderBy = { rating: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else {
    // default: featured first
    orderBy = { isFeatured: "desc" };
  }

  // Fetch data in parallel with safe fallback
  type CategoryWithCount = Prisma.CategoryGetPayload<{
    include: { _count: { select: { products: true } } };
  }>;
  type ProductItem = Prisma.ProductGetPayload<{
    include: { images: { orderBy: { sortOrder: "asc" }; take: 1 } };
  }>;

  let categories: CategoryWithCount[] = [];
  let products: ProductItem[] = [];
  let uniqueBrands: string[] = [];

  try {
    const [fetchedCats, fetchedProds, allBrands] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy,
      }),
      prisma.product.findMany({
        select: { brand: true },
        distinct: ["brand"],
      }),
    ]);
    categories = fetchedCats;
    products = fetchedProds;
    uniqueBrands = allBrands.map((b) => b.brand).sort();
  } catch (err) {
    console.error("Database connection error on CatalogPage:", err);
  }

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
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Каталог</span>
          </nav>

          {/* Catalog Title Banner */}
          <div style={{ marginBottom: "2rem" }}>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "0.5rem",
              }}
            >
              Каталог техники и электроники
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
              Оригинальные гаджеты, флагманские смартфоны, ноутбуки и техника для дома с гарантией
            </p>
          </div>

          {/* Category Cards Carousel / Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog/${cat.slug}`}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  transition: "all var(--transition-fast)",
                }}
                className="category-card-hover"
              >
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#FFF" }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {cat._count.products} товаров <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>

          {/* Main Layout: Filters Sidebar + Products Grid */}
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            {/* Filters Sidebar */}
            <CatalogFilters
              categories={categories}
              brands={uniqueBrands}
            />

            {/* Products Area */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Top Controls Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  background: "var(--bg-card)",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-card)",
                }}
              >
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  Найдено: <strong style={{ color: "#FFF" }}>{products.length}</strong> товаров
                </div>

                <SortDropdown />
              </div>

              {/* Products Grid or Empty State */}
              {products.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "1.25rem",
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
              ) : (
                <EmptyState
                  icon={<PackageOpen size={36} />}
                  title="Товары не найдены"
                  description="По заданным фильтрам ничего не найдено. Попробуйте сбросить фильтры или изменить критерии поиска."
                  actionText="Сбросить фильтры"
                  actionHref="/catalog"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

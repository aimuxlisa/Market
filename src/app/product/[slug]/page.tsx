import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Товар не найден | Nexora Store",
    };
  }

  return {
    title: `${product.name} | Купить в Ташкенте по выгодной цене | Nexora Store`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      attributes: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "PUBLISHED",
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: 4,
  });

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
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ color: "var(--text-secondary)" }}>
              Главная
            </Link>
            <ChevronRight size={14} />
            <Link href="/catalog" style={{ color: "var(--text-secondary)" }}>
              Каталог
            </Link>
            <ChevronRight size={14} />
            <Link
              href={`/catalog/${product.category.slug}`}
              style={{ color: "var(--text-secondary)" }}
            >
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
              {product.name}
            </span>
          </nav>

          {/* Interactive Product Hero (Gallery + Price + Buy button) */}
          <ProductDetailView product={product} />

          {/* Specifications and Description Tabs / Sections */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2.5rem",
              marginBottom: "5rem",
            }}
          >
            {/* Attributes / Specs Table */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <Cpu size={22} color="var(--accent-cyan)" />
                <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF" }}>
                  Характеристики
                </h3>
              </div>

              {product.attributes.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {product.attributes.map((attr, idx) => (
                    <div
                      key={attr.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.85rem 0",
                        borderBottom: idx < product.attributes.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        fontSize: "0.875rem",
                        gap: "1rem",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>{attr.key}</span>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)", textAlign: "right" }}>
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  Подробные характеристики уточняйте у менеджера.
                </p>
              )}
            </div>

            {/* Description Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
              }}
            >
              <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFF", marginBottom: "1.25rem" }}>
                Описание товара
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  fontSize: "0.9375rem",
                  whiteSpace: "pre-line",
                }}
              >
                {product.description}
              </p>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFF" }}>
                  Похожие товары
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  Другие предложения из категории {product.category.name}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {relatedProducts.map((relProd) => (
                  <ProductCard
                    key={relProd.id}
                    id={relProd.id}
                    name={relProd.name}
                    slug={relProd.slug}
                    brand={relProd.brand}
                    price={relProd.price}
                    oldPrice={relProd.oldPrice}
                    rating={relProd.rating}
                    reviewsCount={relProd.reviewsCount}
                    imageUrl={relProd.images[0]?.url}
                    isNew={relProd.isNew}
                    isFeatured={relProd.isFeatured}
                    stock={relProd.stock}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

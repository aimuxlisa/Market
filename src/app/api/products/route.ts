import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    const formattedProducts = products.map((p) => ({
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

    return NextResponse.json({
      categories,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Failed to fetch products for catalog:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить каталог" },
      { status: 500 }
    );
  }
}

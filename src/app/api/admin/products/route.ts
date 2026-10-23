import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin, logAudit } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен. Требуются права администратора." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const categoryId = searchParams.get("categoryId") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { brand: { contains: search } },
      { sku: { contains: search } },
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

interface ImageInput {
  url?: string;
  alt?: string;
}

interface AttributeInput {
  key?: string;
  value?: string;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен. Требуются права администратора." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      sku,
      brand,
      categoryId,
      description,
      price,
      oldPrice,
      stock,
      status = "PUBLISHED",
      isFeatured = false,
      isNew = false,
      images = [],
      attributes = [],
    } = body;

    if (!name?.trim() || !sku?.trim() || !brand?.trim() || !categoryId || price === undefined) {
      return NextResponse.json({ error: "Заполните все обязательные поля (название, артикул, бренд, категория, цена)" }, { status: 400 });
    }

    const finalSlug = (slug?.trim() || name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "")) + "-" + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        sku: sku.trim().toUpperCase(),
        brand: brand.trim(),
        categoryId,
        description: description?.trim() || "",
        price: Math.max(0, parseInt(price, 10)),
        oldPrice: oldPrice ? Math.max(0, parseInt(oldPrice, 10)) : null,
        stock: Math.max(0, parseInt(stock || 0, 10)),
        status,
        isFeatured: Boolean(isFeatured),
        isNew: Boolean(isNew),
        images: {
          create: (images as ImageInput[]).filter((img) => img.url?.trim()).map((img, idx: number) => ({
            url: img.url!.trim(),
            alt: img.alt?.trim() || name.trim(),
            sortOrder: idx,
          })),
        },
        attributes: {
          create: (attributes as AttributeInput[]).filter((attr) => attr.key?.trim() && attr.value?.trim()).map((attr) => ({
            key: attr.key!.trim(),
            value: attr.value!.trim(),
          })),
        },
      },
    });

    await logAudit(admin.email, "CREATE_PRODUCT", "Product", product.id, {
      name: product.name,
      sku: product.sku,
      price: product.price,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Товар с таким артикулом (SKU) или slug уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: "Ошибка при создании товара" }, { status: 500 });
  }
}

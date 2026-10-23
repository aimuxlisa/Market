import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAudit } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const { name, slug, description, icon, imageUrl, sortOrder = 0, isActive = true } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Укажите название категории" }, { status: 400 });
    }

    const finalSlug = (slug?.trim() || name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "")) || `category-${Date.now()}`;

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
        icon: icon?.trim() || "Smartphone",
        imageUrl: imageUrl?.trim() || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive: Boolean(isActive),
      },
    });

    await logAudit(admin.email, "CREATE_CATEGORY", "Category", category.id, {
      name: category.name,
      slug: category.slug,
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Create category error:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Категория с таким slug уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: "Не удалось создать категорию" }, { status: 500 });
  }
}

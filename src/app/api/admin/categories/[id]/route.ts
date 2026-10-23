import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAudit } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { name, slug, description, icon, imageUrl, sortOrder, isActive } = await req.json();

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(icon && { icon: icon.trim() }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    await logAudit(admin.email, "UPDATE_CATEGORY", "Category", id, {
      name: updated.name,
      isActive: updated.isActive,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Не удалось обновить категорию" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Нельзя удалить категорию: в ней находится ${productsCount} товаров. Сначала переместите или удалите товары.` },
        { status: 400 }
      );
    }

    const cat = await prisma.category.delete({ where: { id } });

    await logAudit(admin.email, "DELETE_CATEGORY", "Category", id, { name: cat.name });

    return NextResponse.json({ success: true, message: "Категория успешно удалена" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Не удалось удалить категорию" }, { status: 500 });
  }
}

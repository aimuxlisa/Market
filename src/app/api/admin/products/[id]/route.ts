import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAudit } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      attributes: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

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
    const body = await req.json();
    const {
      name,
      sku,
      brand,
      categoryId,
      description,
      price,
      oldPrice,
      stock,
      status,
      isFeatured,
      isNew,
      images,
      attributes,
    } = body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true, attributes: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    // Update images if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: (images as { url?: string; alt?: string }[]).filter((img) => img.url?.trim()).map((img, idx: number) => ({
          productId: id,
          url: img.url!.trim(),
          alt: img.alt?.trim() || name || existing.name,
          sortOrder: idx,
        })),
      });
    }

    // Update attributes if provided
    if (attributes && Array.isArray(attributes)) {
      await prisma.productAttribute.deleteMany({ where: { productId: id } });
      await prisma.productAttribute.createMany({
        data: (attributes as { key?: string; value?: string }[]).filter((a) => a.key?.trim() && a.value?.trim()).map((a) => ({
          productId: id,
          key: a.key!.trim(),
          value: a.value!.trim(),
        })),
      });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(sku && { sku: sku.trim().toUpperCase() }),
        ...(brand && { brand: brand.trim() }),
        ...(categoryId && { categoryId }),
        ...(description !== undefined && { description: description.trim() }),
        ...(price !== undefined && { price: Math.max(0, parseInt(price, 10)) }),
        ...(oldPrice !== undefined && { oldPrice: oldPrice ? Math.max(0, parseInt(oldPrice, 10)) : null }),
        ...(stock !== undefined && { stock: Math.max(0, parseInt(stock, 10)) }),
        ...(status && { status }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isNew !== undefined && { isNew: Boolean(isNew) }),
      },
    });

    await logAudit(admin.email, "UPDATE_PRODUCT", "Product", id, {
      name: updated.name,
      price: updated.price,
      stock: updated.stock,
      status: updated.status,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Товар с таким артикулом (SKU) уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: "Ошибка при обновлении товара" }, { status: 500 });
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
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    await logAudit(admin.email, "DELETE_PRODUCT", "Product", id, {
      name: product.name,
      sku: product.sku,
    });

    return NextResponse.json({ success: true, message: "Товар успешно удален" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Не удалось удалить товар. Возможно, на него ссылаются оформленные заказы." }, { status: 500 });
  }
}

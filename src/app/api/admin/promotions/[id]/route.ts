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
    const { title, subtitle, badge, desktopImage, mobileImage, href, sortOrder, isActive } = await req.json();

    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle?.trim() || null }),
        ...(badge !== undefined && { badge: badge?.trim() || null }),
        ...(desktopImage && { desktopImage: desktopImage.trim() }),
        ...(mobileImage !== undefined && { mobileImage: mobileImage?.trim() || null }),
        ...(href && { href: href.trim() }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    await logAudit(admin.email, "UPDATE_PROMOTION", "Promotion", id, { title: updated.title, isActive: updated.isActive });

    return NextResponse.json({ success: true, promotion: updated });
  } catch (error) {
    console.error("Update promotion error:", error);
    return NextResponse.json({ error: "Не удалось обновить промо-баннер" }, { status: 500 });
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
    const promo = await prisma.promotion.delete({ where: { id } });
    await logAudit(admin.email, "DELETE_PROMOTION", "Promotion", id, { title: promo.title });

    return NextResponse.json({ success: true, message: "Промо-баннер удален" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    return NextResponse.json({ error: "Не удалось удалить промо-баннер" }, { status: 500 });
  }
}

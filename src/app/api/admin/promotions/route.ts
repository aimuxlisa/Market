import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAudit } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const promotions = await prisma.promotion.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ promotions });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const { title, subtitle, badge, desktopImage, mobileImage, href, sortOrder = 0, isActive = true } = await req.json();

    if (!title?.trim() || !desktopImage?.trim() || !href?.trim()) {
      return NextResponse.json({ error: "Укажите заголовок, изображение и ссылку баннера" }, { status: 400 });
    }

    const promo = await prisma.promotion.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        badge: badge?.trim() || null,
        desktopImage: desktopImage.trim(),
        mobileImage: mobileImage?.trim() || null,
        href: href.trim(),
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive: Boolean(isActive),
      },
    });

    await logAudit(admin.email, "CREATE_PROMOTION", "Promotion", promo.id, { title: promo.title });

    return NextResponse.json({ success: true, promotion: promo });
  } catch (error) {
    console.error("Create promotion error:", error);
    return NextResponse.json({ error: "Не удалось создать промо-баннер" }, { status: 500 });
  }
}

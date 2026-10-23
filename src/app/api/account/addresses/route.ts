import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { city, street, building, apartment, comment, isDefault } = await req.json();

    if (!city?.trim() || !street?.trim() || !building?.trim()) {
      return NextResponse.json(
        { error: "Пожалуйста, заполните город, улицу и дом." },
        { status: 400 }
      );
    }

    // If marked default, unset others first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.id,
        city: city.trim(),
        street: street.trim(),
        building: building.trim(),
        apartment: apartment?.trim() || null,
        comment: comment?.trim() || null,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Address create error:", error);
    return NextResponse.json({ error: "Не удалось сохранить адрес" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID адреса обязателен" }, { status: 400 });
    }

    // Verify ownership
    const deleted = await prisma.address.deleteMany({
      where: {
        id,
        userId: session.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Адрес не найден или доступ запрещен" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Адрес удален" });
  } catch (error) {
    console.error("Address delete error:", error);
    return NextResponse.json({ error: "Не удалось удалить адрес" }, { status: 500 });
  }
}

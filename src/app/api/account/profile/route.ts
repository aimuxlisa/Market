import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, setSessionCookie } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      addresses: true,
      _count: {
        select: { orders: true, favorites: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { name, phone, avatarUrl } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Имя не может быть пустым" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
      },
    });

    // Refresh session cookie
    await setSessionCookie({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      avatarUrl: updated.avatarUrl,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatarUrl: updated.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Не удалось обновить профиль" }, { status: 500 });
  }
}

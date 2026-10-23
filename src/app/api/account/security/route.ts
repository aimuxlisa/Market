import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Введите текущий и новый пароль." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Новый пароль должен содержать минимум 6 символов." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Пользователь не найден или пароль не установлен." },
        { status: 404 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Неверный текущий пароль." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Пароль успешно обновлён.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Не удалось изменить пароль. Попробуйте снова." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { validateTelegramInitData } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { initData } = body;

    if (!initData) {
      return NextResponse.json(
        { error: "Параметр initData отсутствует" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    let validatedUser = null;

    if (botToken) {
      const validation = validateTelegramInitData(initData, botToken);
      if (!validation.isValid || !validation.user) {
        return NextResponse.json(
          { error: "Неверная подпись данных Telegram" },
          { status: 401 }
        );
      }
      validatedUser = validation.user;
    } else {
      // In development or if bot token is not configured yet, parse user from initData
      const params = new URLSearchParams(initData);
      const userRaw = params.get("user");
      if (userRaw) {
        try {
          validatedUser = JSON.parse(userRaw);
        } catch {
          // ignore parse error
        }
      }
    }

    if (!validatedUser || !validatedUser.id) {
      return NextResponse.json(
        { error: "Не удалось получить профиль пользователя Telegram" },
        { status: 400 }
      );
    }

    const tgEmail = `tg_${validatedUser.id}@telegram.nexora.uz`;
    const fullName = [validatedUser.first_name, validatedUser.last_name]
      .filter(Boolean)
      .join(" ") || `Пользователь Telegram ${validatedUser.id}`;

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        email: tgEmail,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: tgEmail,
          name: fullName,
          role: "CUSTOMER",
          avatarUrl: validatedUser.photo_url || null,
        },
      });
    } else {
      // Update avatar if provided
      if (validatedUser.photo_url && user.avatarUrl !== validatedUser.photo_url) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: validatedUser.photo_url,
            name: fullName,
          },
        });
      }
    }

    // Set standard session cookie
    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Telegram auth error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка при авторизации Telegram" },
      { status: 500 }
    );
  }
}

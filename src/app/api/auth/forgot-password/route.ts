import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Пожалуйста, укажите email." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user (silently, without leaking presence per SPEC.md)
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // In production: generate reset token and send email via SMTP/Resend
      console.log(`[PASSWORD_RESET] Mock reset token generated for ${user.email}`);
    }

    return NextResponse.json({
      success: true,
      message:
        "Если указанный email зарегистрирован в системе, мы отправили инструкции по сбросу пароля.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при отправке запроса." },
      { status: 500 }
    );
  }
}

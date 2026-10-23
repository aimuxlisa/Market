import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [productsCount, categoriesCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      app: "Nexora Store API",
      database: "connected",
      environment: process.env.NODE_ENV,
      counts: {
        products: productsCount,
        categories: categoriesCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

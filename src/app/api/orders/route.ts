import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      deliveryCity,
      deliveryAddress,
      deliveryMethod = "standard",
      paymentMethod = "cash",
      comment = "",
      promoCode = "",
    } = body;

    // 1. Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Корзина пуста. Невозможно оформить заказ." },
        { status: 400 }
      );
    }

    if (!customerName?.trim() || !customerPhone?.trim() || !deliveryAddress?.trim()) {
      return NextResponse.json(
        { error: "Пожалуйста, заполните имя, номер телефона и адрес доставки." },
        { status: 400 }
      );
    }

    // 2. Fetch current user from session (if logged in)
    const currentUser = await getCurrentUser();

    // 3. Verify products, prices, and stock strictly on server (T4.5)
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Один или несколько товаров в корзине не найдены в каталоге." },
        { status: 400 }
      );
    }

    const dbProductsMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const verifiedItems: {
      productId: string;
      productNameSnapshot: string;
      skuSnapshot: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }[] = [];

    for (const item of items) {
      const dbProduct = dbProductsMap.get(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Товар с ID ${item.productId} не найден.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));

      // Check stock
      if (dbProduct.stock < qty) {
        return NextResponse.json(
          {
            error: `Недостаточно остатка для товара «${dbProduct.name}». Доступно на складе: ${dbProduct.stock} шт.`,
          },
          { status: 400 }
        );
      }

      const lineTotal = dbProduct.price * qty;
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        productId: dbProduct.id,
        productNameSnapshot: dbProduct.name,
        skuSnapshot: dbProduct.sku,
        unitPrice: dbProduct.price,
        quantity: qty,
        lineTotal,
      });
    }

    // 4. Calculate discount strictly on server
    let discount = 0;
    const cleanPromo = promoCode.trim().toUpperCase();
    if (cleanPromo === "NEXORA10") {
      discount = Math.round((calculatedSubtotal * 10) / 100);
    } else if (cleanPromo === "PROMO20") {
      discount = Math.round((calculatedSubtotal * 20) / 100);
    }

    // 5. Calculate delivery fee
    let deliveryFee = 0;
    if (deliveryMethod === "express") {
      deliveryFee = 45000;
    } else if (deliveryMethod === "pickup") {
      deliveryFee = 0;
    } else {
      // standard
      deliveryFee = calculatedSubtotal >= 1000000 ? 0 : 25000;
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal - discount + deliveryFee);

    // 6. Generate order number (e.g. NX-2026-4821)
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NX-${year}-${randomDigits}`;

    // 7. Atomic transaction: create order + snapshot items + decrement stock
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Decrement stock for each purchased item
      for (const item of verifiedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: currentUser?.id ?? null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || currentUser?.email || null,
          deliveryCity: deliveryCity.trim() || "Ташкент",
          deliveryAddress: deliveryAddress.trim(),
          deliveryMethod,
          paymentMethod,
          comment: comment?.trim() || null,
          status: "pending",
          paymentStatus: paymentMethod === "cash" || paymentMethod === "card_on_delivery" ? "pending" : "pending",
          subtotal: calculatedSubtotal,
          deliveryFee,
          discount,
          total: calculatedTotal,
          items: {
            create: verifiedItems,
          },
        },
      });

      // Write Audit Log
      await tx.auditLog.create({
        data: {
          actor: currentUser ? currentUser.email : "guest",
          action: "CREATE_ORDER",
          entity: "Order",
          entityId: order.id,
          metadata: JSON.stringify({
            orderNumber: order.orderNumber,
            total: order.total,
            itemsCount: verifiedItems.length,
          }),
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: createdOrder.total,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Произошла непредвиденная ошибка при оформлении заказа. Попробуйте снова." },
      { status: 500 }
    );
  }
}

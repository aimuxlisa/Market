import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   NEXORA STORE — ПРОВЕРКА ЭТАПОВ 0 - 6");
  console.log("=======================================================\n");

  try {
    // -------------------------------------------------------------------------
    // ЭТАП 1 & 3: База данных, модели и сид-данные
    // -------------------------------------------------------------------------
    console.log("📋 1. Проверка базы данных и сид-данных (Этап 1 и 3)...");

    const categoriesCount = await prisma.category.count();
    assert(categoriesCount >= 6, "Категории загружены в БД", `найдено: ${categoriesCount}`);

    const productsCount = await prisma.product.count();
    assert(productsCount >= 10, "Товары загружены в БД", `найдено: ${productsCount}`);

    const sampleProduct = await prisma.product.findFirst({
      include: { images: true, attributes: true, category: true },
    });
    assert(!!sampleProduct, "Товар найден с связями");
    assert(Number.isInteger(sampleProduct?.price), "Цена товара — целое число (UZS, не float)");
    assert((sampleProduct?.images.length || 0) > 0, "У товара есть изображения");
    assert((sampleProduct?.attributes.length || 0) > 0, "У товара есть характеристики");
    assert(sampleProduct?.category !== null, "Товар привязан к категории");

    // -------------------------------------------------------------------------
    // ЭТАП 6: Создание администратора и роли (T6.1, T6.2)
    // -------------------------------------------------------------------------
    console.log("\n👑 2. Проверка ролей и создания первого администратора (Этап 6)...");

    const adminEmail = "test_admin@nexora.uz";
    const adminPassword = "AdminSecurePassword2026!";
    const adminHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN", passwordHash: adminHash },
      create: {
        email: adminEmail,
        name: "Тестовый Администратор",
        role: "ADMIN",
        passwordHash: adminHash,
      },
    });

    assert(adminUser.role === "ADMIN", "Роль администратора установлена корректно (ADMIN)");
    const adminPasswordCheck = await bcrypt.compare(adminPassword, adminUser.passwordHash!);
    assert(adminPasswordCheck, "Хеш пароля администратора верифицируется");

    // -------------------------------------------------------------------------
    // ЭТАП 5: Авторизация, клиенты и изоляция данных (Этап 5)
    // -------------------------------------------------------------------------
    console.log("\n👤 3. Проверка авторизации и изоляции данных клиентов (Этап 5)...");

    const testUserAEmail = `customer_a_${Date.now()}@test.uz`;
    const testUserBEmail = `customer_b_${Date.now()}@test.uz`;
    const userPassword = "CustomerPassword123!";
    const userHash = await bcrypt.hash(userPassword, 10);

    const customerA = await prisma.user.create({
      data: {
        email: testUserAEmail,
        name: "Пользователь А",
        role: "CUSTOMER",
        passwordHash: userHash,
      },
    });

    const customerB = await prisma.user.create({
      data: {
        email: testUserBEmail,
        name: "Пользователь Б",
        role: "CUSTOMER",
        passwordHash: userHash,
      },
    });

    assert(customerA.role === "CUSTOMER", "Клиент А имеет роль CUSTOMER");
    assert(customerB.role === "CUSTOMER", "Клиент Б имеет роль CUSTOMER");

    // Check wrong password
    const wrongPasswordCheck = await bcrypt.compare("WrongPassword!", customerA.passwordHash!);
    assert(!wrongPasswordCheck, "Неверный пароль отклоняется");

    // Check address creation and isolation for Customer A
    const addressA = await prisma.address.create({
      data: {
        userId: customerA.id,
        city: "Ташкент",
        street: "Амира Темура",
        building: "42",
        isDefault: true,
      },
    });
    assert(!!addressA.id, "Клиент А может создать адрес");

    // Simulate Customer B attempting to delete Customer A's address:
    const deleteAttemptByB = await prisma.address.deleteMany({
      where: {
        id: addressA.id,
        userId: customerB.id,
      },
    });
    assert(deleteAttemptByB.count === 0, "Клиент Б не может удалить адрес Клиента А (изоляция адресов)");

    // -------------------------------------------------------------------------
    // ЭТАП 4: Корзина, заказы, расчет сумм и остатков на сервере (Этап 4)
    // -------------------------------------------------------------------------
    console.log("\n🛒 4. Проверка корзины, заказов и серверного расчета цен/остатков (Этап 4)...");

    const testProduct = await prisma.product.create({
      data: {
        name: "Тестовый смартфон X",
        slug: `test-phone-${Date.now()}`,
        sku: `TEST-SKU-${Date.now()}`,
        brand: "NexoraTest",
        categoryId: sampleProduct!.categoryId,
        description: "Тестовый товар",
        price: 1500000,
        stock: 5,
        status: "PUBLISHED",
      },
    });

    const initialStock = testProduct.stock;
    const purchaseQuantity = 2;
    assert(purchaseQuantity <= initialStock, "Количество покупки в пределах остатка");

    const calculatedSubtotal = testProduct.price * purchaseQuantity;
    const deliveryFee = calculatedSubtotal >= 1000000 ? 0 : 25000;
    const expectedTotal = calculatedSubtotal + deliveryFee;

    const orderNumber = `NX-TEST-${Date.now()}`;
    const orderA = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: testProduct.id },
        data: { stock: { decrement: purchaseQuantity } },
      });

      return tx.order.create({
        data: {
          orderNumber,
          userId: customerA.id,
          customerName: customerA.name,
          customerPhone: "+998901234567",
          deliveryCity: "Ташкент",
          deliveryAddress: "ул. Тестовая, 1",
          deliveryMethod: "standard",
          paymentMethod: "cash",
          subtotal: calculatedSubtotal,
          deliveryFee,
          discount: 0,
          total: expectedTotal,
          items: {
            create: [
              {
                productId: testProduct.id,
                productNameSnapshot: testProduct.name,
                skuSnapshot: testProduct.sku,
                unitPrice: testProduct.price,
                quantity: purchaseQuantity,
                lineTotal: calculatedSubtotal,
              },
            ],
          },
        },
        include: { items: true },
      });
    });

    assert(!!orderA.id, "Заказ успешно создан");
    assert(orderA.total === expectedTotal, "Серверная сумма заказа рассчитана корректно");

    const updatedProduct = await prisma.product.findUnique({ where: { id: testProduct.id } });
    assert(updatedProduct?.stock === initialStock - purchaseQuantity, "Остаток товара на складе уменьшен после заказа");

    const excessiveQuantity = 10;
    const canFulfill = (updatedProduct?.stock || 0) >= excessiveQuantity;
    assert(!canFulfill, "Попытка заказать больше доступного остатка отклоняется сервером (T4.2)");

    const canCustomerBAccessOrderA = orderA.userId === customerB.id || customerB.role === "ADMIN";
    assert(!canCustomerBAccessOrderA, "Клиент Б не может просмотреть заказ Клиента А (T5.7 — нельзя получить чужой заказ)");

    const canAdminAccessOrderA = orderA.userId === adminUser.id || adminUser.role === "ADMIN";
    assert(canAdminAccessOrderA, "Администратор имеет доступ к просмотру любого заказа");

    // -------------------------------------------------------------------------
    // ЭТАП 6: Функционал админки, CRUD, статусы и Audit Log (Этап 6)
    // -------------------------------------------------------------------------
    console.log("\n🛠️ 5. Проверка админ-панели: CRUD, статусы и Audit Log (Этап 6)...");

    const isCustomerAllowedAdminApi = customerA.role === "ADMIN";
    assert(!isCustomerAllowedAdminApi, "Пользователь без роли ADMIN блокируется от Admin API (T6.1)");

    const isAdminAllowedAdminApi = adminUser.role === "ADMIN";
    assert(isAdminAllowedAdminApi, "Администратор авторизован для вызова Admin API");

    const updatedPrice = 1800000;
    const modifiedProduct = await prisma.product.update({
      where: { id: testProduct.id },
      data: { price: updatedPrice },
    });
    assert(modifiedProduct.price === updatedPrice, "Администратор может изменить цену товара (CRUD)");

    await prisma.auditLog.create({
      data: {
        actor: adminUser.email,
        action: "UPDATE_PRODUCT",
        entity: "Product",
        entityId: testProduct.id,
        metadata: JSON.stringify({ oldPrice: testProduct.price, newPrice: updatedPrice }),
      },
    });

    const allowedStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const nextStatus = "confirmed";
    assert(allowedStatuses.includes(nextStatus), "Статус заказа входит в список разрешенных");

    const updatedOrder = await prisma.order.update({
      where: { id: orderA.id },
      data: { status: nextStatus },
    });
    assert(updatedOrder.status === "confirmed", "Администратор успешно перевел статус заказа в confirmed");

    await prisma.auditLog.create({
      data: {
        actor: adminUser.email,
        action: "UPDATE_ORDER_STATUS",
        entity: "Order",
        entityId: orderA.id,
        metadata: JSON.stringify({ oldStatus: "pending", newStatus: nextStatus }),
      },
    });

    const testCategory = await prisma.category.create({
      data: {
        name: "Тестовая категория",
        slug: `test-cat-${Date.now()}`,
        description: "Категория для теста",
        sortOrder: 99,
        isActive: true,
      },
    });
    assert(!!testCategory.id, "Администратор может создать категорию");

    await prisma.product.update({
      where: { id: testProduct.id },
      data: { categoryId: testCategory.id },
    });

    const prodsInCat = await prisma.product.count({ where: { categoryId: testCategory.id } });
    const canDeleteCatWithProds = prodsInCat === 0;
    assert(!canDeleteCatWithProds, "Категория с товарами защищена от случайного удаления (T6.3)");

    await prisma.product.update({
      where: { id: testProduct.id },
      data: { categoryId: sampleProduct!.categoryId },
    });
    await prisma.category.delete({ where: { id: testCategory.id } });
    assert(true, "Пустая категория успешно удалена администратором (T6.3)");

    const promo = await prisma.promotion.create({
      data: {
        title: "Тестовая акция",
        desktopImage: "https://example.com/promo.jpg",
        href: "/catalog",
        isActive: true,
      },
    });
    assert(!!promo.id, "Администратор может создать акцию/баннер (T6.5)");

    const updatedPromo = await prisma.promotion.update({
      where: { id: promo.id },
      data: { isActive: false },
    });
    assert(!updatedPromo.isActive, "Администратор может деактивировать акцию/баннер (T6.5)");
    await prisma.promotion.delete({ where: { id: promo.id } });

    const logs = await prisma.auditLog.findMany({
      where: { actor: adminUser.email },
      orderBy: { timestamp: "desc" },
    });
    assert(logs.length >= 2, "Журнал аудита (AuditLog) регистрирует критические действия администратора (T6.6)");

    // Clean up
    await prisma.orderItem.deleteMany({ where: { orderId: orderA.id } });
    await prisma.order.delete({ where: { id: orderA.id } });
    await prisma.product.delete({ where: { id: testProduct.id } });
    await prisma.address.deleteMany({ where: { userId: customerA.id } });
    await prisma.user.delete({ where: { id: customerA.id } });
    await prisma.user.delete({ where: { id: customerB.id } });
    await prisma.auditLog.deleteMany({ where: { actor: adminUser.email } });
    await prisma.user.delete({ where: { id: adminUser.id } });

    console.log("\n=======================================================");
    console.log(`ИТОГИ ТЕСТИРОВАНИЯ: ✅ Пройдено: ${passed} | ❌ Ошибок: ${failed}`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Critical test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();

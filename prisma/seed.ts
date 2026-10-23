import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Nexora Store database seeding...");

  // 1. Clear existing records in proper dependency order
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const adminPasswordHash = await bcrypt.hash("AdminPassword2026!", 10);
  const customerPasswordHash = await bcrypt.hash("CustomerPassword2026!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Администратор Nexora",
      email: "admin@nexora.uz",
      phone: "+998 90 123 45 67",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Алишер Каримов",
      email: "customer@nexora.uz",
      phone: "+998 90 987 65 43",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
      addresses: {
        create: [
          {
            city: "Ташкент",
            street: "проспект Амира Темура",
            building: "45",
            apartment: "12",
            comment: "Домофон 12В, 3 этаж",
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log(`👤 Created users: Admin (${admin.email}), Customer (${customer.email})`);

  // 3. Create Categories
  const categoriesData = [
    {
      name: "Смартфоны и гаджеты",
      slug: "smartphones",
      description: "Флагманские смартфоны, умные часы и аксессуары",
      icon: "Smartphone",
      sortOrder: 1,
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    },
    {
      name: "Ноутбуки и ПК",
      slug: "laptops",
      description: "Мощные рабочие станции, ультрабуки и геймерские компьютеры",
      icon: "Laptop",
      sortOrder: 2,
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    },
    {
      name: "Телевизоры и аудио",
      slug: "tv-audio",
      description: "OLED и QLED экраны, саундбары и Hi-Fi аудиосистемы",
      icon: "Tv",
      sortOrder: 3,
      imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
    },
    {
      name: "Бытовая техника",
      slug: "appliances",
      description: "Премиальная техника для кухни, ухода за домом и климата",
      icon: "Refrigerator",
      sortOrder: 4,
      imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=400&fit=crop",
    },
    {
      name: "Игровые приставки",
      slug: "gaming",
      description: "Консоли нового поколения, геймпады и аксессуары",
      icon: "Gamepad2",
      sortOrder: 5,
      imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
    },
    {
      name: "Умный дом",
      slug: "smart-home",
      description: "Датчики, роботы-пылесосы, умные лампы и центры управления",
      icon: "Home",
      sortOrder: 6,
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
  }
  console.log(`📁 Created ${Object.keys(createdCategories).length} categories`);

  // 4. Create Products
  const products = [
    {
      categoryId: createdCategories["smartphones"],
      brand: "Apple",
      name: "iPhone 16 Pro Max 256GB Desert Titanium",
      slug: "iphone-16-pro-max-256gb-desert-titanium",
      sku: "APL-IP16PM-256-DT",
      description: "Флагманский смартфон с титановым корпусом, мощнейшим чипом Apple A18 Pro, кнопкой Camera Control и 5-кратным оптическим зумом. Невероятная автономность и яркий экран Super Retina XDR.",
      price: 16490000,
      oldPrice: 17990000,
      stock: 14,
      isFeatured: true,
      isNew: true,
      rating: 4.9,
      reviewsCount: 38,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.9" Super Retina XDR OLED 120Hz' },
        { key: "Процессор", value: "Apple A18 Pro" },
        { key: "Память", value: "256 GB" },
        { key: "Основная камера", value: "48 MP + 48 MP + 12 MP (5x zoom)" },
        { key: "Цвет", value: "Desert Titanium (Пустынный титан)" },
      ],
    },
    {
      categoryId: createdCategories["smartphones"],
      brand: "Apple",
      name: "iPhone 16 128GB Ultramarine",
      slug: "iphone-16-128gb-ultramarine",
      sku: "APL-IP16-128-UM",
      description: "Современный базовый флагман с ярким корпусом цвета Ultramarine, инновационным Dynamic Island, процессором A18 и новейшей кнопкой Camera Control.",
      price: 11290000,
      oldPrice: 12190000,
      stock: 22,
      isFeatured: true,
      isNew: true,
      rating: 4.8,
      reviewsCount: 19,
      images: [
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.1" Super Retina XDR' },
        { key: "Процессор", value: "Apple A18" },
        { key: "Память", value: "128 GB" },
        { key: "Цвет", value: "Ultramarine (Ультрамарин)" },
      ],
    },
    {
      categoryId: createdCategories["smartphones"],
      brand: "Samsung",
      name: "Galaxy S25 Ultra 512GB Titanium Black",
      slug: "samsung-galaxy-s25-ultra-512gb-titanium-black",
      sku: "SAM-S25U-512-TB",
      description: "Новейший флагман со встроенным электронным пером S Pen, процессором Snapdragon 8 Elite, камерой 200 Мп и расширенным искусственным интеллектом Galaxy AI.",
      price: 15890000,
      oldPrice: 16990000,
      stock: 19,
      isFeatured: true,
      isNew: true,
      rating: 4.8,
      reviewsCount: 29,
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.8" Dynamic AMOLED 2X 120Hz' },
        { key: "Процессор", value: "Snapdragon 8 Elite for Galaxy" },
        { key: "Память", value: "512 GB / 12 GB RAM" },
        { key: "Камера", value: "200 MP + 50 MP + 50 MP + 10 MP" },
        { key: "Аккумулятор", value: "5000 mAh" },
      ],
    },
    {
      categoryId: createdCategories["smartphones"],
      brand: "Xiaomi",
      name: "Xiaomi 14 Ultra 512GB Leica Edition",
      slug: "xiaomi-14-ultra-512gb-leica",
      sku: "XIA-14U-512-LEICA",
      description: "Фотофлагман с квартетом 50-мегапиксельных камер Leica, дюймовым сенсором LYT-900, быстрой зарядкой HyperCharge 90W и премиальной экокожей.",
      price: 13490000,
      oldPrice: 14890000,
      stock: 10,
      isFeatured: false,
      isNew: false,
      rating: 4.7,
      reviewsCount: 15,
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.73" AMOLED WQHD+ 120Hz' },
        { key: "Камера", value: "4x 50 MP Leica Summilux" },
        { key: "Процессор", value: "Snapdragon 8 Gen 3" },
        { key: "Память", value: "512 GB / 16 GB RAM" },
      ],
    },
    {
      categoryId: createdCategories["laptops"],
      brand: "Apple",
      name: 'MacBook Pro 14" M4 Pro 24GB / 512GB Space Black',
      slug: "macbook-pro-14-m4-pro-24gb-512gb-space-black",
      sku: "APL-MBP14-M4P-SB",
      description: "Профессиональный ноутбук на базе революционного чипа M4 Pro. Потрясающий экран Liquid Retina XDR с нанотекстурой, автономность до 24 часов и поддержка Thunderbolt 5.",
      price: 24990000,
      oldPrice: 26500000,
      stock: 8,
      isFeatured: true,
      isNew: true,
      rating: 5.0,
      reviewsCount: 17,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Процессор", value: "Apple M4 Pro (12 ядер CPU, 16 ядер GPU)" },
        { key: "Оперативная память", value: "24 GB Unified" },
        { key: "Накопитель", value: "512 GB SSD" },
        { key: "Экран", value: '14.2" Liquid Retina XDR (3024x1964)' },
        { key: "Автономность", value: "До 24 часов" },
      ],
    },
    {
      categoryId: createdCategories["laptops"],
      brand: "Apple",
      name: 'MacBook Air 15" M3 16GB / 512GB Midnight',
      slug: "macbook-air-15-m3-16gb-512gb-midnight",
      sku: "APL-MBA15-M3-MD",
      description: "Сверхтонкий ноутбук в элегантном цвете Midnight с потрясающим 15.3-дюймовым экраном Liquid Retina, бесшумным пассивным охлаждением и автономностью на весь день.",
      price: 18490000,
      oldPrice: 19990000,
      stock: 15,
      isFeatured: false,
      isNew: true,
      rating: 4.9,
      reviewsCount: 23,
      images: [
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Процессор", value: "Apple M3 (8 ядер CPU, 10 ядер GPU)" },
        { key: "Память", value: "16 GB RAM / 512 GB SSD" },
        { key: "Экран", value: '15.3" Liquid Retina IPS' },
      ],
    },
    {
      categoryId: createdCategories["laptops"],
      brand: "ASUS",
      name: 'ROG Zephyrus G16 OLED 2025 Core Ultra 9 / RTX 4080',
      slug: "asus-rog-zephyrus-g16-oled-2025-rtx4080",
      sku: "ASUS-ROG-G16-4080",
      description: "Тонкий алюминиевый корпус, великолепная ROG Nebula OLED матрица 240Hz, топовая видеокарта GeForce RTX 4080 и продвинутое охлаждение с испарительной камерой.",
      price: 28990000,
      oldPrice: 31200000,
      stock: 5,
      isFeatured: true,
      isNew: true,
      rating: 4.9,
      reviewsCount: 12,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Процессор", value: "Intel Core Ultra 9 185H" },
        { key: "Видеокарта", value: "NVIDIA GeForce RTX 4080 12GB" },
        { key: "Память", value: "32 GB LPDDR5X / 1 TB NVMe SSD" },
        { key: "Экран", value: '16" 2.5K OLED 240Hz 0.2ms' },
      ],
    },
    {
      categoryId: createdCategories["gaming"],
      brand: "Sony",
      name: "PlayStation 5 Slim 1TB + Второй DualSense в подарок",
      slug: "sony-playstation-5-slim-1tb-bundle",
      sku: "SNY-PS5-SLIM-1TB",
      description: "Компактная обновленная консоль PS5 с накопителем 1 ТБ, сверхскоростным SSD, поддержкой трассировки лучей и инновационным тактильным откликом DualSense.",
      price: 6490000,
      oldPrice: 6990000,
      stock: 25,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 84,
      images: [
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Накопитель", value: "1 TB Custom NVMe SSD" },
        { key: "Разрешение", value: "До 4K 120Hz / HDR / 8K" },
        { key: "Комплектация", value: "Консоль, 2 геймпада DualSense, кабели" },
      ],
    },
    {
      categoryId: createdCategories["gaming"],
      brand: "Nintendo",
      name: "Nintendo Switch OLED Mario Red Edition",
      slug: "nintendo-switch-oled-mario-red",
      sku: "NTD-SW-OLED-RED",
      description: "Портативная игровая система с сочным 7-дюймовым OLED дисплеем, регулируемой подставкой, док-станцией с портом LAN и культовым красным стилем Mario.",
      price: 4390000,
      oldPrice: 4790000,
      stock: 14,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewsCount: 39,
      images: [
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '7.0" OLED Multi-Touch' },
        { key: "Память", value: "64 GB + microSD слот" },
        { key: "Режимы игры", value: "ТВ, настольный, портативный" },
      ],
    },
    {
      categoryId: createdCategories["appliances"],
      brand: "Dyson",
      name: "Беспроводной пылесос Dyson V15 Detect Absolute Extra",
      slug: "dyson-v15-detect-absolute-extra",
      sku: "DYS-V15-ABS-EX",
      description: "Мощнейший пылесос с лазерной подсветкой невидимой пыли, пьезодатчиком измерения частиц и фильтрацией HEPA до 99.99%. До 60 минут работы от аккумулятора.",
      price: 8990000,
      oldPrice: 9790000,
      stock: 11,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 45,
      images: [
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Мощность всасывания", value: "240 AW" },
        { key: "Время работы", value: "До 60 минут" },
        { key: "Фильтрация", value: "HEPA до 0.1 микрона" },
        { key: "Вес", value: "3.1 кг" },
      ],
    },
    {
      categoryId: createdCategories["appliances"],
      brand: "Dyson",
      name: "Стайлер для волос Dyson Airwrap Complete Long Strawberry Bronze",
      slug: "dyson-airwrap-complete-long-strawberry",
      sku: "DYS-AW-LONG-SB",
      description: "Интеллектуальный стайлер с эффектом Коанда для завивки, сушки и разглаживания волос без экстремального перегрева. Лимитированная расцветка Strawberry Bronze.",
      price: 7490000,
      oldPrice: 7990000,
      stock: 9,
      isFeatured: false,
      isNew: true,
      rating: 5.0,
      reviewsCount: 52,
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Мощность", value: "1300 W" },
        { key: "Контроль температуры", value: "Измерение до 40 раз в секунду" },
        { key: "Комплектация", value: "6 насадок, чехол из экокожи" },
      ],
    },
    {
      categoryId: createdCategories["appliances"],
      brand: "Philips",
      name: "Аэрогриль Philips OpanXXL Connected HD9285",
      slug: "philips-airfryer-xxl-connected",
      sku: "PHI-AF-XXL-9285",
      description: "Готовка с минимальным количеством масла благодаря технологии Rapid Air. 16 автоматических программ и удалённое управление через приложение HomeID.",
      price: 2990000,
      oldPrice: 3490000,
      stock: 20,
      isFeatured: false,
      isNew: false,
      rating: 4.7,
      reviewsCount: 18,
      images: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Объём чаши", value: "7.2 л (до 1.4 кг продуктов)" },
        { key: "Мощность", value: "2000 W" },
        { key: "Управление", value: "Сенсорный дисплей + Wi-Fi" },
      ],
    },
    {
      categoryId: createdCategories["smart-home"],
      brand: "Xiaomi",
      name: "Робот-пылесос Xiaomi Robot Vacuum X20+ со станцией очистки",
      slug: "xiaomi-robot-vacuum-x20-plus",
      sku: "XIA-VAC-X20P",
      description: "Полностью автоматизированная станция: самоочистка пылесборника за 10 секунд, автоматическая мойка и сушка вращающихся швабр горячим воздухом.",
      price: 4790000,
      oldPrice: 5390000,
      stock: 18,
      isFeatured: false,
      isNew: true,
      rating: 4.7,
      reviewsCount: 31,
      images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Сила всасывания", value: "6000 Pa" },
        { key: "Навигация", value: "LDS лазерная 360° + AI камера" },
        { key: "Станция", value: "Автослив, мойка и сушка швабр" },
      ],
    },
    {
      categoryId: createdCategories["tv-audio"],
      brand: "Samsung",
      name: 'Телевизор 65" OLED 4K Samsung S90D Smart AI',
      slug: "samsung-65-oled-4k-s90d-smart-ai",
      sku: "SAM-TV65-S90D",
      description: "Ослепительно яркий OLED экран с глубочайшим черным цветом, процессор NQ4 AI Gen2 с масштабированием до 4K, поддержка частоты 144Hz и Dolby Atmos.",
      price: 19990000,
      oldPrice: 22490000,
      stock: 6,
      isFeatured: true,
      isNew: false,
      rating: 4.8,
      reviewsCount: 19,
      images: [
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Диагональ", value: '65" (163 см)' },
        { key: "Технология", value: "OLED (Quantum HDR OLED)" },
        { key: "Частота обновления", value: "144 Hz (Motion Xcelerator)" },
        { key: "Звук", value: "40W 2.1ch Dolby Atmos" },
      ],
    },
    {
      categoryId: createdCategories["tv-audio"],
      brand: "Sony",
      name: "Беспроводные наушники Sony WH-1000XM5 с шумоподавлением",
      slug: "sony-wh-1000xm5-black",
      sku: "SNY-WH1000XM5-BLK",
      description: "Лидер в индустрии шумоподавления благодаря процессорам V1 и QN1, 8 микрофонам, 30 часам работы без подзарядки и непревзойденному качеству звука Hi-Res Audio.",
      price: 4390000,
      oldPrice: 4790000,
      stock: 16,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 67,
      images: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Тип", value: "Полноразмерные беспроводные" },
        { key: "Шумоподавление", value: "Active Noise Cancelling (ANC)" },
        { key: "Автономность", value: "До 30 часов с ANC" },
        { key: "Кодеки", value: "LDAC, AAC, SBC" },
      ],
    },
    {
      categoryId: createdCategories["tv-audio"],
      brand: "Apple",
      name: "AirPods Pro 2 с кейсом MagSafe (USB-C)",
      slug: "apple-airpods-pro-2-usbc",
      sku: "APL-APP2-USBC",
      description: "Активное шумоподавление до двух раз мощнее, адаптивное аудио, режим прозрачности и защита от влаги IP54. Порт USB-C.",
      price: 3190000,
      oldPrice: 3490000,
      stock: 28,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 112,
      images: [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Чип", value: "Apple H2" },
        { key: "Разъём", value: "USB-C MagSafe" },
        { key: "Шумоподавление", value: "2x мощнее + Адаптивный звук" },
      ],
    },
    // --- 30 новых позиций, популярных и доступных на рынке Ташкента (Malika, Texnomart, MediaPark, Uzum) ---
    // 1. Смартфон Artel (национальный бестселлер)
    {
      categoryId: createdCategories["smartphones"],
      brand: "Artel",
      name: "Смартфон Artel U5 4GB/64GB Gradient Blue",
      slug: "artel-u5-4gb-64gb-gradient-blue",
      sku: "ART-U5-64-BLU",
      description: "Доступный и надежный смартфон узбекского производства с ярким экраном, ёмкой батареей 5000 мАч и официальной гарантией в сервисных центрах по всему Ташкенту.",
      price: 1390000,
      oldPrice: 1550000,
      stock: 35,
      isFeatured: false,
      isNew: false,
      rating: 4.6,
      reviewsCount: 42,
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.5" HD+ IPS' },
        { key: "Память", value: "64 GB / 4 GB RAM" },
        { key: "Аккумулятор", value: "5000 mAh" },
        { key: "Гарантия", value: "1 год официальной гарантии Artel Узбекистан" },
      ],
    },
    // 2. Redmi Note 13 Pro (топ продаж рынка Малика)
    {
      categoryId: createdCategories["smartphones"],
      brand: "Xiaomi",
      name: "Xiaomi Redmi Note 13 Pro 8GB/256GB Midnight Black",
      slug: "xiaomi-redmi-note-13-pro-8-256-black",
      sku: "XIA-RN13P-256-BLK",
      description: "Один из самых популярных смартфонов в Узбекистане: камера 200 Мп с оптической стабилизацией, яркий AMOLED 120 Гц и турбо-зарядка 67 Вт.",
      price: 3250000,
      oldPrice: 3600000,
      stock: 45,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 156,
      images: [
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.67" AMOLED 120Hz CrystalRes' },
        { key: "Основная камера", value: "200 MP с OIS" },
        { key: "Память", value: "256 GB / 8 GB RAM" },
        { key: "Зарядка", value: "67W HyperCharge" },
      ],
    },
    // 3. Samsung Galaxy A55 5G
    {
      categoryId: createdCategories["smartphones"],
      brand: "Samsung",
      name: "Samsung Galaxy A55 5G 8GB/128GB Awesome Navy",
      slug: "samsung-galaxy-a55-5g-128gb-navy",
      sku: "SAM-A55-128-NVY",
      description: "Металлическая рамка, влагозащита IP67, экран Super AMOLED и фирменная система безопасности Samsung Knox. Идеальный баланс цены и надежности.",
      price: 4450000,
      oldPrice: 4890000,
      stock: 24,
      isFeatured: false,
      isNew: true,
      rating: 4.8,
      reviewsCount: 88,
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '6.6" Super AMOLED 120Hz' },
        { key: "Процессор", value: "Exynos 1480" },
        { key: "Влагозащита", value: "IP67" },
        { key: "Память", value: "128 GB / 8 GB RAM" },
      ],
    },
    // 4. Смарт-часы Apple Watch Series 10
    {
      categoryId: createdCategories["smartphones"],
      brand: "Apple",
      name: "Apple Watch Series 10 GPS 46mm Jet Black",
      slug: "apple-watch-series-10-gps-46mm-jet-black",
      sku: "APL-AW10-46-JB",
      description: "Самый тонкий корпус в истории Apple Watch, увеличенный широкоугольный OLED-дисплей, датчик глубины и температуры воды, ускоренная зарядка.",
      price: 5690000,
      oldPrice: 6200000,
      stock: 18,
      isFeatured: true,
      isNew: true,
      rating: 4.9,
      reviewsCount: 34,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Размер корпуса", value: "46 мм" },
        { key: "Материал", value: "Алюминий Jet Black" },
        { key: "Датчики", value: "ЭКГ, кислород в крови, мониторинг сна" },
        { key: "Влагозащита", value: "WR50 (до 50 метров)" },
      ],
    },
    // 5. Фитнес-браслет Xiaomi Smart Band 9
    {
      categoryId: createdCategories["smartphones"],
      brand: "Xiaomi",
      name: "Фитнес-браслет Xiaomi Smart Band 9 Midnight Black",
      slug: "xiaomi-smart-band-9-black",
      sku: "XIA-SBAND9-BLK",
      description: "Бестселлер в Ташкенте: металлический корпус, пиковая яркость до 1200 нит, более 150 спортивных режимов и до 21 дня работы на одном заряде.",
      price: 490000,
      oldPrice: 590000,
      stock: 60,
      isFeatured: false,
      isNew: true,
      rating: 4.8,
      reviewsCount: 174,
      images: [
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '1.62" AMOLED 60Hz' },
        { key: "Автономность", value: "До 21 дня" },
        { key: "Водостойкость", value: "5 ATM" },
      ],
    },
    // 6. Ноутбук Lenovo Legion 5 Pro (хит компьютерного рынка Навои и Малика)
    {
      categoryId: createdCategories["laptops"],
      brand: "Lenovo",
      name: 'Игровой ноутбук Lenovo Legion 5 Pro 16" Ryzen 7 / RTX 4070',
      slug: "lenovo-legion-5-pro-16-ryzen7-rtx4070",
      sku: "LNV-LEG5P-4070",
      description: "Флагманский игровой ноутбук для геймеров и 3D-моделлеров Ташкента. Процессор AMD Ryzen 7 7745HX, видеокарта RTX 4070 140W и дисплей WQXGA 240Hz.",
      price: 21990000,
      oldPrice: 23900000,
      stock: 7,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 28,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Процессор", value: "AMD Ryzen 7 7745HX (8 ядер, 16 потоков)" },
        { key: "Видеокарта", value: "NVIDIA GeForce RTX 4070 8GB GDDR6" },
        { key: "Оперативная память", value: "32 GB DDR5 5200MHz" },
        { key: "Экран", value: '16" WQXGA (2560x1600) IPS 240Hz' },
      ],
    },
    // 7. Ноутбук ASUS TUF Gaming A15
    {
      categoryId: createdCategories["laptops"],
      brand: "ASUS",
      name: 'Ноутбук ASUS TUF Gaming A15 Core i7 / RTX 4060 Mecha Gray',
      slug: "asus-tuf-gaming-a15-rtx4060",
      sku: "ASUS-TUF-A15-4060",
      description: "Надежный военный стандарт прочности MIL-STD-810H, отличная система охлаждения и высокая производительность для игр и учебы.",
      price: 14790000,
      oldPrice: 15990000,
      stock: 12,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewsCount: 46,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Процессор", value: "Intel Core i7-13620H" },
        { key: "Видеокарта", value: "GeForce RTX 4060 8GB" },
        { key: "Память", value: "16 GB DDR5 / 1 TB SSD" },
        { key: "Экран", value: '15.6" Full HD 144Hz' },
      ],
    },
    // 8. Ультрабук HP Pavilion 15
    {
      categoryId: createdCategories["laptops"],
      brand: "HP",
      name: 'Ноутбук HP Pavilion 15-eg Core i5 16GB/512GB Silver',
      slug: "hp-pavilion-15-core-i5-16-512",
      sku: "HP-PAV15-I5-SLV",
      description: "Классический ноутбук для офиса, бизнеса и учебы в Ташкенте. Тонкий алюминиевый корпус, чистый звук B&O и быстрая зарядка HP Fast Charge.",
      price: 8290000,
      oldPrice: 8990000,
      stock: 20,
      isFeatured: false,
      isNew: false,
      rating: 4.7,
      reviewsCount: 33,
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Процессор", value: "Intel Core i5-1335U" },
        { key: "Память", value: "16 GB RAM / 512 GB SSD" },
        { key: "Экран", value: '15.6" Full HD IPS матовый' },
        { key: "Вес", value: "1.74 кг" },
      ],
    },
    // 9. Телевизор Artel 43" Smart TV (народный выбор Узбекистана)
    {
      categoryId: createdCategories["tv-audio"],
      brand: "Artel",
      name: 'Smart Телевизор Artel A43LU8500 43" 4K UHD Android TV',
      slug: "artel-tv-43-4k-uhd-android",
      sku: "ART-TV43-4K-8500",
      description: "Самый продаваемый телевизор в Ташкенте с официальной 3-летней гарантией. Поддержка YouTube, онлайн-кинотеатров (Allplay, ITV, Kinopoisk) и голосового управления.",
      price: 3690000,
      oldPrice: 4100000,
      stock: 30,
      isFeatured: true,
      isNew: false,
      rating: 4.7,
      reviewsCount: 95,
      images: [
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Диагональ", value: '43" (109 см)' },
        { key: "Разрешение", value: "4K Ultra HD (3840x2160)" },
        { key: "Операционная система", value: "Android TV с Google Assistant" },
        { key: "Гарантия", value: "3 года полной гарантии в Узбекистане" },
      ],
    },
    // 10. Телевизор LG OLED 55" C4
    {
      categoryId: createdCategories["tv-audio"],
      brand: "LG",
      name: 'Телевизор 55" LG OLED evo OLED55C4 4K 144Hz',
      slug: "lg-oled-55-c4-4k-144hz",
      sku: "LG-OLED55-C4",
      description: "Премиальный корейский OLED-телевизор с процессором Alpha 9 AI Gen7, бесконечной контрастностью, звуком Dolby Atmos и 4 портами HDMI 2.1.",
      price: 18490000,
      oldPrice: 20500000,
      stock: 8,
      isFeatured: false,
      isNew: true,
      rating: 5.0,
      reviewsCount: 22,
      images: [
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Диагональ", value: '55" (139 см)' },
        { key: "Панель", value: "LG OLED evo Brightness Booster" },
        { key: "Частота", value: "144 Hz Gaming" },
        { key: "Звук", value: "Dolby Atmos 40W 2.2ch" },
      ],
    },
    // 11. Портативная колонка JBL Charge 5 (популярно для дач в Чарваке и отдыха)
    {
      categoryId: createdCategories["tv-audio"],
      brand: "JBL",
      name: "Портативная акустика JBL Charge 5 Squad камуфляж",
      slug: "jbl-charge-5-squad-camo",
      sku: "JBL-CH5-SQD",
      description: "Мощный легендарный звук JBL Original Pro Sound, защита от воды и пыли IP67, до 20 часов музыки и функция повербанка для зарядки телефона.",
      price: 1890000,
      oldPrice: 2190000,
      stock: 25,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 140,
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Мощность", value: "40W RMS" },
        { key: "Автономность", value: "До 20 часов" },
        { key: "Влагозащита", value: "IP67" },
        { key: "Функция Powerbank", value: "Есть" },
      ],
    },
    // 12. Саундбар Samsung с беспроводным сабвуфером
    {
      categoryId: createdCategories["tv-audio"],
      brand: "Samsung",
      name: "Саундбар с сабвуфером Samsung HW-B650 430W 3.1ch",
      slug: "samsung-soundbar-hw-b650-430w",
      sku: "SAM-SB-HWB650",
      description: "Кинематографический звук с центральным динамиком для чистых диалогов, мощным басом сабвуфера и поддержкой DTS Virtual:X.",
      price: 2990000,
      oldPrice: 3390000,
      stock: 14,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewsCount: 31,
      images: [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Мощность", value: "430 W" },
        { key: "Каналы", value: "3.1ch" },
        { key: "Подключение", value: "Bluetooth, HDMI ARC, Оптика" },
      ],
    },
    // 13. Кондиционер Artel Inverter (критически важный товар для климата Ташкента)
    {
      categoryId: createdCategories["appliances"],
      brand: "Artel",
      name: "Инверторный кондиционер Artel Shahrisabz Inverter 12HP (до 35 кв.м)",
      slug: "artel-shahrisabz-inverter-12hp",
      sku: "ART-AC-SHAH12-INV",
      description: "Флагманский инверторный кондиционер, адаптированный к жарким ташкентским чилля и зимним морозам до -15°C. Энергосбережение класса A++ и низкий уровень шума.",
      price: 5290000,
      oldPrice: 5800000,
      stock: 22,
      isFeatured: true,
      isNew: false,
      rating: 4.8,
      reviewsCount: 79,
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Площадь обслуживания", value: "До 35 кв.м (12 000 BTU)" },
        { key: "Тип компрессора", value: "Инверторный (Highly/Hitachi)" },
        { key: "Хладагент", value: "Экологичный R32" },
        { key: "Режимы работы", value: "Охлаждение, обогрев, вентиляция, осушение" },
      ],
    },
    // 14. Двухкамерный холодильник Shivaki
    {
      categoryId: createdCategories["appliances"],
      brand: "Shivaki",
      name: "Холодильник Shivaki HD-430FWEN Total No Frost Inverter Dark Inox",
      slug: "shivaki-hd-430fwen-total-no-frost",
      sku: "SHV-REF-430FWEN",
      description: "Вместительный семейный холодильник узбекского производства по японским технологиям. Система Total No Frost, тихий инвертор и электронный контроль температуры.",
      price: 6190000,
      oldPrice: 6890000,
      stock: 15,
      isFeatured: false,
      isNew: false,
      rating: 4.7,
      reviewsCount: 38,
      images: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Общий объем", value: "330 л" },
        { key: "Разморозка", value: "Total No Frost" },
        { key: "Цвет", value: "Темный графит (Dark Inox)" },
        { key: "Гарантия", value: "3 года в сервисных центрах Узбекистана" },
      ],
    },
    // 15. Стиральная машина LG с паром Steam
    {
      categoryId: createdCategories["appliances"],
      brand: "LG",
      name: "Стиральная машина LG AI DD F2V5GS0W 8.5 кг с обработкой паром",
      slug: "lg-ai-dd-f2v5gs0w-8kg-steam",
      sku: "LG-WM-F2V5GS0W",
      description: "Интеллектуальная система AI DD подбирает оптимальный алгоритм вращения барабана для бережной стирки. Функция пара Steam удаляет до 99.9% бытовых аллергенов.",
      price: 6890000,
      oldPrice: 7490000,
      stock: 14,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 64,
      images: [
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Максимальная загрузка", value: "8.5 кг" },
        { key: "Скорость отжима", value: "До 1200 об/мин" },
        { key: "Мотор", value: "Inverter Direct Drive (прямой привод)" },
        { key: "Особенности", value: "Обработка паром SpaSteam" },
      ],
    },
    // 16. Кофемашина DeLonghi Magnifica S
    {
      categoryId: createdCategories["appliances"],
      brand: "DeLonghi",
      name: "Автоматическая кофемашина De'Longhi Magnifica S ECAM22.110.B",
      slug: "delonghi-magnifica-s-ecam22-110-b",
      sku: "DL-MAGS-22110B",
      description: "Итальянское качество эспрессо и капучино у вас дома. Встроенная кофемолка со стальными жерновами, ручной капучинатор и регулировка крепости кофе.",
      price: 5490000,
      oldPrice: 6100000,
      stock: 16,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 81,
      images: [
        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Давление помпы", value: "15 бар" },
        { key: "Используемый кофе", value: "Зерновой и молотый" },
        { key: "Ёмкость для воды", value: "1.8 л" },
        { key: "Капучинатор", value: "Система Cappuccino с паром" },
      ],
    },
    // 17. Микроволновая печь Samsung с грилем
    {
      categoryId: createdCategories["appliances"],
      brand: "Samsung",
      name: "Микроволновая печь Samsung MG23T5018AK с грилем 23л",
      slug: "samsung-mg23t5018ak-grill-23l",
      sku: "SAM-MWO-MG23T",
      description: "Стильный черный стеклянный фасад, биокерамическое антибактериальное покрытие камеры и режим Grill Fry для хрустящей корочки.",
      price: 1890000,
      oldPrice: 2150000,
      stock: 28,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewsCount: 53,
      images: [
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Объем", value: "23 литра" },
        { key: "Мощность СВЧ / Гриль", value: "800 Вт / 1100 Вт" },
        { key: "Покрытие", value: "Биокерамическая эмаль (10 лет гарантии)" },
      ],
    },
    // 18. Электрический чайник Xiaomi Smart Kettle Pro
    {
      categoryId: createdCategories["appliances"],
      brand: "Xiaomi",
      name: "Умный электрический чайник Xiaomi Smart Kettle Pro 1.5L White",
      slug: "xiaomi-smart-kettle-pro-1-5l",
      sku: "XIA-KET-PRO-WHT",
      description: "OLED-экран с отображением температуры воды в реальном времени, колба из нержавеющей стали 304 и поддержание тепла до 12 часов через Mi Home.",
      price: 520000,
      oldPrice: 620000,
      stock: 40,
      isFeatured: false,
      isNew: false,
      rating: 4.7,
      reviewsCount: 110,
      images: [
        "https://images.unsplash.com/photo-1594213114663-ddf4f24cf707?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Объем", value: "1.5 литра" },
        { key: "Мощность", value: "1800 Вт" },
        { key: "Дисплей", value: "Цифровой экран температуры" },
        { key: "Связь", value: "Bluetooth / Mi Home" },
      ],
    },
    // 19. Умная колонка Яндекс Станция Миди с Zigbee и Алисой (очень популярна в домах Ташкента)
    {
      categoryId: createdCategories["smart-home"],
      brand: "Yandex",
      name: "Умная колонка Яндекс Станция Миди с голосовым помощником Алиса",
      slug: "yandex-station-midi-alisa-zigbee",
      sku: "YNDX-ST-MIDI-BLK",
      description: "Мощный звук 24 Вт с технологией Room Correction, встроенный хаб управления умным домом Zigbee и умный ассистент Алиса с нейросетью YandexGPT.",
      price: 1990000,
      oldPrice: 2290000,
      stock: 35,
      isFeatured: true,
      isNew: true,
      rating: 4.9,
      reviewsCount: 135,
      images: [
        "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Мощность звука", value: "24 Вт (3 динамика)" },
        { key: "Встроенный хаб", value: "Zigbee + Wi-Fi + Bluetooth" },
        { key: "LED-дисплей", value: "Часы, анимация эмоций, погода" },
      ],
    },
    // 20. Умная камера видеонаблюдения Xiaomi Smart Camera C400
    {
      categoryId: createdCategories["smart-home"],
      brand: "Xiaomi",
      name: "IP-камера видеонаблюдения Xiaomi Smart Camera C400 2.5K",
      slug: "xiaomi-smart-camera-c400-2-5k",
      sku: "XIA-CAM-C400",
      description: "Безопасность дома и квартиры в Ташкенте: четкое разрешение 2.5K 4MP, панорамный обзор 360 градусов, ночное видение и детекция людей с ИИ.",
      price: 580000,
      oldPrice: 690000,
      stock: 42,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewsCount: 67,
      images: [
        "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Разрешение", value: "2.5K (2560x1440) 4 MP" },
        { key: "Угол обзора", value: "360° по горизонтали, 106° по вертикали" },
        { key: "Двусторонняя связь", value: "Микрофон и динамик" },
      ],
    },
    // 21. Умный увлажнитель воздуха Smartmi Evaporative Humidifier
    {
      categoryId: createdCategories["smart-home"],
      brand: "Smartmi",
      name: "Увлажнитель воздуха Smartmi Evaporative Humidifier 3 5L",
      slug: "smartmi-evaporative-humidifier-3",
      sku: "SMI-HUM-3-5L",
      description: "Естественное увлажнение воздуха без белого налета и тумана. Идеально для сухого ташкентского климата. Резервуар 5 литров и производительность до 350 мл/ч.",
      price: 1590000,
      oldPrice: 1790000,
      stock: 19,
      isFeatured: false,
      isNew: true,
      rating: 4.8,
      reviewsCount: 41,
      images: [
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Тип увлажнения", value: "Холодное естественное испарение" },
        { key: "Емкость бака", value: "5 литров" },
        { key: "Расход воды", value: "До 350 мл/час" },
        { key: "Управление со смартфона", value: "Mi Home / Apple HomeKit" },
      ],
    },
    // 22. Очиститель воздуха Xiaomi Smart Air Purifier 4
    {
      categoryId: createdCategories["smart-home"],
      brand: "Xiaomi",
      name: "Очиститель воздуха Xiaomi Smart Air Purifier 4 Pro",
      slug: "xiaomi-smart-air-purifier-4-pro",
      sku: "XIA-PURIF-4PRO",
      description: "Эффективная очистка от ташкентской пыли, пыльцы и аллергенов. Тройной фильтр задерживает до 99.97% частиц размером от 0.3 микрона.",
      price: 3290000,
      oldPrice: 3690000,
      stock: 15,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 58,
      images: [
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Площадь действия", value: "До 60 кв.м" },
        { key: "Производительность CADR", value: "500 куб.м/час" },
        { key: "Лазерный датчик", value: "Контроль частиц PM2.5 и PM10" },
      ],
    },
    // 23. Электронный замок на дверь с биометрией Aqara
    {
      categoryId: createdCategories["smart-home"],
      brand: "Aqara",
      name: "Умный дверной замок Aqara Smart Door Lock D100 Zigbee",
      slug: "aqara-smart-door-lock-d100",
      sku: "AQR-LOCK-D100",
      description: "Бесключевой доступ в квартиру: сканер отпечатка пальца на ручке, ввод PIN-кода, карты NFC, временные пароли и открытие через Apple HomeKit.",
      price: 3890000,
      oldPrice: 4290000,
      stock: 11,
      isFeatured: false,
      isNew: true,
      rating: 4.9,
      reviewsCount: 26,
      images: [
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Способы открытия", value: "Отпечаток пальца, пароль, NFC, ключ, приложение" },
        { key: "Экосистемы", value: "Apple HomeKit, Aqara Home" },
        { key: "Батарея", value: "Li-Ion аккумулятор до 12 месяцев работы" },
      ],
    },
    // 24. Игровая консоль Xbox Series X
    {
      categoryId: createdCategories["gaming"],
      brand: "Microsoft",
      name: "Игровая консоль Microsoft Xbox Series X 1TB Black",
      slug: "xbox-series-x-1tb-black",
      sku: "MS-XBSX-1TB",
      description: "Самая мощная консоль Xbox с вычислительной мощностью 12 терафлопс, технологией Xbox Velocity Architecture и подпиской Xbox Game Pass.",
      price: 6690000,
      oldPrice: 7200000,
      stock: 13,
      isFeatured: true,
      isNew: false,
      rating: 4.8,
      reviewsCount: 51,
      images: [
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Производительность", value: "12 TFLOPS AMD RDNA 2" },
        { key: "Память", value: "1 TB Custom NVMe SSD" },
        { key: "Разрешение", value: "Подлинный 4K гейминг до 120 FPS" },
      ],
    },
    // 25. Геймпад Sony DualSense Wireless Controller
    {
      categoryId: createdCategories["gaming"],
      brand: "Sony",
      name: "Беспроводной геймпад Sony DualSense Midnight Black для PS5/PC",
      slug: "sony-dualsense-controller-midnight-black",
      sku: "SNY-DS5-BLK",
      description: "Оригинальный контроллер PlayStation 5 с адаптивными триггерами, тактильной обратной связью и встроенным микрофоном. Совместим с PS5, ПК, iOS и Android.",
      price: 990000,
      oldPrice: 1150000,
      stock: 45,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 162,
      images: [
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Интерфейс", value: "Bluetooth 5.1 / USB Type-C" },
        { key: "Функции", value: "Тактильный виброотклик, триггеры с сопротивлением" },
        { key: "Совместимость", value: "PlayStation 5, Windows PC, macOS, iPhone, Android" },
      ],
    },
    // 26. Портативная консоль Valve Steam Deck OLED 512GB
    {
      categoryId: createdCategories["gaming"],
      brand: "Valve",
      name: "Портативная игровая консоль Valve Steam Deck OLED 512GB",
      slug: "valve-steam-deck-oled-512gb",
      sku: "VLV-SD-OLED-512",
      description: "Играйте в хиты из библиотеки Steam где угодно: яркий HDR OLED-экран 90 Гц, увеличенное время работы батареи и улучшенное охлаждение.",
      price: 8890000,
      oldPrice: 9690000,
      stock: 8,
      isFeatured: true,
      isNew: true,
      rating: 5.0,
      reviewsCount: 39,
      images: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Экран", value: '7.4" HDR OLED 90Hz 1000 нит' },
        { key: "Накопитель", value: "512 GB NVMe SSD" },
        { key: "Процессор", value: "Кастомный APU AMD 6 нм" },
      ],
    },
    // 27. Монитор игровой Xiaomi Curved Gaming Monitor 34"
    {
      categoryId: createdCategories["laptops"],
      brand: "Xiaomi",
      name: 'Изогнутый монитор Xiaomi Curved Gaming Monitor G34WQi 34" 180Hz',
      slug: "xiaomi-curved-gaming-monitor-g34wqi",
      sku: "XIA-MON-G34WQI",
      description: "Широкоформатный монитор 21:9 для работы в Ташкенте с кодом, таблицами и графикой, а также для игр с полным погружением благодаря изгибу 1500R.",
      price: 4390000,
      oldPrice: 4890000,
      stock: 14,
      isFeatured: false,
      isNew: true,
      rating: 4.8,
      reviewsCount: 37,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Диагональ и формат", value: '34 дюйма, 21:9 WQHD (3440х1440)' },
        { key: "Частота обновления", value: "180 Hz, 1ms FreeSync" },
        { key: "Цветовой охват", value: "95% DCI-P3, 100% sRGB" },
      ],
    },
    // 28. Беспроводные наушники Marshall Major IV
    {
      categoryId: createdCategories["tv-audio"],
      brand: "Marshall",
      name: "Накладные беспроводные наушники Marshall Major IV Bluetooth Black",
      slug: "marshall-major-iv-bluetooth-black",
      sku: "MSH-MJ4-BLK",
      description: "Культовый рок-н-ролльный дизайн, более 80 часов воспроизведения без подзарядки, беспроводная зарядка и фирменный многопозиционный джойстик.",
      price: 1890000,
      oldPrice: 2190000,
      stock: 22,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 93,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Автономность", value: "Более 80 часов" },
        { key: "Зарядка", value: "USB-C + Беспроводная зарядка Qi" },
        { key: "Вес", value: "165 г (складная конструкция)" },
      ],
    },
    // 29. Внешний аккумулятор Baseus 20000mAh 65W (топ продаж в Ташкенте)
    {
      categoryId: createdCategories["smartphones"],
      brand: "Baseus",
      name: "Повербанк Baseus Blade 20000mAh 65W Power Delivery для ноутбука",
      slug: "baseus-blade-power-bank-20000mah-65w",
      sku: "BAS-BLADE-65W",
      description: "Тонкий цифровой повербанк толщиной всего 18 мм. Мощности 65 Вт достаточно для быстрой зарядки MacBook, ноутбуков Dell/HP/Lenovo и флагманских смартфонов.",
      price: 790000,
      oldPrice: 920000,
      stock: 36,
      isFeatured: false,
      isNew: false,
      rating: 4.8,
      reviewsCount: 115,
      images: [
        "https://images.unsplash.com/photo-1609592426868-6d5108622fce?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Емкость", value: "20 000 mAh (74 Wh)" },
        { key: "Выходная мощность", value: "До 65W (USB-C Power Delivery)" },
        { key: "Экран", value: "Индикатор процента заряда и времени до окончания" },
      ],
    },
    // 30. Wi-Fi Роутер TP-Link Archer AX73 (популярен с ташкентскими провайдерами Sarkor, TPS, Turon, Uztelecom)
    {
      categoryId: createdCategories["smart-home"],
      brand: "TP-Link",
      name: "Двухдиапазонный гигабитный роутер TP-Link Archer AX73 Wi-Fi 6 AX5400",
      slug: "tp-link-archer-ax73-wifi-6",
      sku: "TPL-ARCH-AX73",
      description: "Мощный маршрутизатор нового стандарта Wi-Fi 6 со скоростью до 5400 Мбит/с, 6 антеннами с функцией Beamforming и стабильной поддержкой десятков устройств умного дома.",
      price: 1590000,
      oldPrice: 1790000,
      stock: 24,
      isFeatured: false,
      isNew: false,
      rating: 4.9,
      reviewsCount: 72,
      images: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=800&fit=crop",
      ],
      attributes: [
        { key: "Стандарт", value: "Wi-Fi 6 (802.11ax) AX5400" },
        { key: "Антенны", value: "6 внешних антенн с усилителями сигнала" },
        { key: "Порты", value: "1x Gigabit WAN + 4x Gigabit LAN + USB 3.0" },
      ],
    },
  ];

  for (const item of products) {
    const { images, attributes, ...productData } = item;
    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((url, idx) => ({ url, sortOrder: idx })),
        },
        attributes: {
          create: attributes,
        },
      },
    });
  }
  console.log(`📦 Created ${products.length} catalog products`);

  // 5. Create Bento Grid Promotions
  const promotions = [
    {
      title: "Флагманы 2026: Новая эра скорости",
      subtitle: "iPhone 16 Pro и Galaxy S25 с официальной гарантией и мгновенной доставкой",
      badge: "Хит сезона",
      desktopImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=600&fit=crop",
      href: "/catalog/smartphones",
      sortOrder: 1,
    },
    {
      title: "MacBook & Pro Laptops",
      subtitle: "Для дизайнеров, разработчиков и креаторов",
      badge: "Выгода до 15%",
      desktopImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
      href: "/catalog/laptops",
      sortOrder: 2,
    },
    {
      title: "PlayStation 5 Slim Bundle",
      subtitle: "Второй геймпад в подарок",
      badge: "Спецпредложение",
      desktopImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
      href: "/product/sony-playstation-5-slim-1tb-bundle",
      sortOrder: 3,
    },
    {
      title: "Умный дом и чистота Dyson",
      subtitle: "Инновации для непревзойденного уюта",
      badge: "Популярно",
      desktopImage: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=400&fit=crop",
      href: "/catalog/appliances",
      sortOrder: 4,
    },
  ];

  for (const promo of promotions) {
    await prisma.promotion.create({ data: promo });
  }
  console.log(`🎨 Created ${promotions.length} homepage promotions`);

  // 6. Create Demo Order
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    const demoOrder = await prisma.order.create({
      data: {
        orderNumber: "NX-2026-1001",
        userId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone ?? "+998 90 987 65 43",
        customerEmail: customer.email,
        deliveryCity: "Ташкент",
        deliveryAddress: "проспект Амира Темура, 45, кв 12",
        deliveryMethod: "express",
        paymentMethod: "cash",
        status: "processing",
        paymentStatus: "pending",
        subtotal: firstProduct.price,
        deliveryFee: 25000,
        discount: 0,
        total: firstProduct.price + 25000,
        items: {
          create: [
            {
              productId: firstProduct.id,
              productNameSnapshot: firstProduct.name,
              skuSnapshot: firstProduct.sku,
              unitPrice: firstProduct.price,
              quantity: 1,
              lineTotal: firstProduct.price,
            },
          ],
        },
      },
    });
    console.log(`🛒 Created demo order: ${demoOrder.orderNumber}`);
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

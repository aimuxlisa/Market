import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { MobileNav } from "@/components/layout/MobileNav";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { TelegramProvider } from "@/context/TelegramContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "HAVEN ELECTRONICS | Премиальный интернет-магазин техники в Узбекистане",
  description:
    "Официальный онлайн-магазин флагманской электроники и техники. Смартфоны Apple iPhone, Samsung Galaxy, ноутбуки MacBook M4, консоли PlayStation 5 Pro и техника Dyson с гарантией и доставкой по Ташкенту и всему Узбекистану. Цены в сумах.",
  keywords: [
    "Haven Electronics",
    "интернет магазин техники Ташкент",
    "купить iPhone в Ташкенте",
    "MacBook Pro M4 Ташкент",
    "Samsung Galaxy S25 Ultra Узбекистан",
    "электроника цены в сумах",
    "PlayStation 5 Pro Ташкент",
  ],
  authors: [{ name: "Haven Electronics Group" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <DynamicBackground />
        <TelegramProvider>
          <FavoritesProvider>
            <CartProvider>
              <div id="app-root" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                {children}
                <MobileNav />
              </div>
            </CartProvider>
          </FavoritesProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}

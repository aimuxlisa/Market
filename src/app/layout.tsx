import type { Metadata, Viewport } from "next";
import { MobileNav } from "@/components/layout/MobileNav";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Nexora Store | Премиальный интернет-магазин электроники в Узбекистане",
  description:
    "Официальный онлайн-магазин флагманской электроники и техники для дома. Смартфоны, ноутбуки, консоли и бытовая техника с быстрой доставкой по Ташкенту и Узбекистану.",
  keywords: [
    "Nexora Store",
    "электроника Ташкент",
    "купить iPhone Узбекистан",
    "интернет-магазин электроники",
    "ноутбуки",
    "бытовая техника",
  ],
  authors: [{ name: "Nexora Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <DynamicBackground />
        <CartProvider>
          <div id="app-root" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {children}
            <MobileNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

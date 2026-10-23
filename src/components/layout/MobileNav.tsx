"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

interface MobileNavProps {
  favoritesCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  favoritesCount,
}) => {
  const pathname = usePathname();
  const { totalCount: cartCount } = useCart();
  const { favoritesCount: storedFavCount } = useFavorites();
  const effectiveFavCount = favoritesCount !== undefined ? favoritesCount : storedFavCount;

  const navItems = [
    { label: "Главная", href: "/", icon: Home },
    { label: "Каталог", href: "/catalog", icon: LayoutGrid },
    { label: "Избранное", href: "/favorites", icon: Heart, badge: effectiveFavCount },
    { label: "Корзина", href: "/cart", icon: ShoppingBag, badge: cartCount },
    { label: "Кабинет", href: "/account", icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
          >
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
              {Boolean(item.badge && item.badge > 0) && (
                <span className="mobile-nav-badge">{item.badge}</span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

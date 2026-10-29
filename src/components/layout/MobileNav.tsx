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
            style={{
              color: isActive ? "#DFC5A0" : "#8E9BAE",
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.7} />
              {Boolean(item.badge && item.badge > 0) && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    background: "#C29B63",
                    color: "#06080D",
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    minWidth: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: "0.6875rem", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

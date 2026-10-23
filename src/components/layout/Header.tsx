"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Phone,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

interface HeaderProps {
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
}) => {
  const { totalCount: cartCount } = useCart();
  const { favoritesCount: storedFavCount } = useFavorites();
  const effectiveFavCount = favoritesCount !== undefined ? favoritesCount : storedFavCount;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navCategories = [
    { name: "Смартфоны и гаджеты", slug: "smartphones" },
    { name: "Ноутбуки и ПК", slug: "laptops" },
    { name: "Телевизоры и аудио", slug: "tv-audio" },
    { name: "Бытовая техника", slug: "appliances" },
    { name: "Игровые приставки", slug: "gaming" },
    { name: "Умный дом", slug: "smart-home" },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 60 }}>
      {/* Top announcement ticker */}
      <div
        style={{
          background: "rgba(5, 4, 13, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0.45rem 1rem",
          fontSize: "0.8125rem",
          color: "var(--text-secondary)",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <ShieldCheck size={14} color="var(--accent-cyan)" /> Официальная гарантия до 24 мес.
            </span>
            <span className="hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <Zap size={14} color="var(--accent-coral)" /> Экспресс-доставка по Ташкенту от 2 часов
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <span className="hide-mobile" style={{ color: "var(--text-muted)" }}>Ташкент, Узбекистан</span>
            <a href="tel:+998712000000" style={{ color: "var(--text-primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <Phone size={13} color="var(--accent-cyan)" /> +998 (71) 200-00-00
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div
        style={{
          background: "rgba(8, 6, 22, 0.72)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-card)",
          padding: "0.85rem 0",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="btn-icon mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Открыть меню"
            title="Меню"
          >
            <Menu size={22} />
          </button>

          {/* Brand Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#FFF",
                fontSize: "1.25rem",
                boxShadow: "0 0 16px rgba(0, 229, 255, 0.4)",
              }}
            >
              N
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#FFF" }}>
                NEXORA<span style={{ color: "var(--accent-cyan)" }}>.</span>
              </span>
              <span style={{ fontSize: "0.625rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "-3px" }}>
                Store · Uzbekistan
              </span>
            </div>
          </Link>

          {/* Catalog Button (Desktop) */}
          <Link href="/catalog" className="desktop-catalog-btn">
            <Button variant="secondary" size="md" leftIcon={<LayoutGrid size={18} />}>
              Каталог
            </Button>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: 1,
              maxWidth: "540px",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Поиск по товарам (iPhone 16, Dyson, PS5, MacBook)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "5.5rem",
                height: "44px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-surface)",
                fontSize: "0.875rem",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{
                position: "absolute",
                right: "4px",
                borderRadius: "var(--radius-full)",
                padding: "0.4rem 0.95rem",
                fontWeight: 700,
              }}
            >
              Найти
            </button>
          </form>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Link href="/favorites">
              <button
                type="button"
                className="btn-icon"
                aria-label="Избранное"
                title="Избранное"
                style={{ position: "relative" }}
              >
                <Heart size={20} />
                {effectiveFavCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      background: "var(--accent-coral)",
                      color: "#FFF",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {effectiveFavCount}
                  </span>
                )}
              </button>
            </Link>

            <Link href="/cart">
              <button
                type="button"
                className="btn-icon"
                aria-label="Корзина"
                title="Корзина"
                style={{ position: "relative" }}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      background: "var(--accent-cyan)",
                      color: "var(--text-inverse)",
                      fontSize: "0.6875rem",
                      fontWeight: 800,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            <Link href="/account" className="hide-mobile">
              <button
                type="button"
                className="btn-icon"
                aria-label="Личный кабинет"
                title="Личный кабинет"
              >
                <User size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div
        style={{
          background: "rgba(12, 9, 28, 0.68)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0.55rem 0",
          overflowX: "auto",
        }}
        className="categories-scroll-bar"
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.35rem",
            whiteSpace: "nowrap",
            fontSize: "0.875rem",
          }}
        >
          <Link
            href="/catalog"
            style={{
              color: "var(--accent-cyan)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            Все категории
          </Link>
          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              style={{
                color: pathname === `/catalog/${cat.slug}` ? "var(--accent-cyan)" : "var(--text-secondary)",
                fontWeight: pathname === `/catalog/${cat.slug}` ? 700 : 500,
              }}
            >
              {cat.name}
            </Link>
          ))}
          <span style={{ marginLeft: "auto", color: "var(--accent-coral)", fontWeight: 700 }}>
            🔥 Скидки недели
          </span>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(4, 7, 14, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: "82%",
              maxWidth: "340px",
              height: "100%",
              background: "var(--bg-secondary)",
              borderRight: "1px solid var(--border-card)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    color: "#FFF",
                  }}
                >
                  N
                </div>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#FFF" }}>
                  NEXORA STORE
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Закрыть меню"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/catalog" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="cyan" size="sm" style={{ width: "100%" }} leftIcon={<LayoutGrid size={16} />}>
                  Каталог
                </Button>
              </Link>
              <Link href="/account" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" style={{ width: "100%" }} leftIcon={<User size={16} />}>
                  Кабинет
                </Button>
              </Link>
            </div>

            {/* Category Navigation List */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                Категории товаров
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 0.9rem",
                      borderRadius: "var(--radius-md)",
                      background: pathname === `/catalog/${cat.slug}` ? "var(--bg-surface)" : "transparent",
                      color: pathname === `/catalog/${cat.slug}` ? "var(--accent-cyan)" : "var(--text-primary)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                    }}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Information */}
            <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Круглосуточная поддержка:</p>
              <a href="tel:+998712000000" style={{ color: "var(--accent-cyan)", fontWeight: 700, fontSize: "1rem" }}>
                +998 (71) 200-00-00
              </a>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                г. Ташкент, доставка по всему Узбекистану
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

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
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

interface HeaderProps {
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ favoritesCount }) => {
  const { totalCount: cartCount } = useCart();
  const { favoritesCount: storedFavCount } = useFavorites();
  const effectiveFavCount = favoritesCount !== undefined ? favoritesCount : storedFavCount;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultSent, setConsultSent] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen || consultModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, consultModalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSent(true);
    setTimeout(() => {
      setConsultSent(false);
      setConsultModalOpen(false);
    }, 2200);
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 80,
          background: "rgba(6, 8, 13, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.1rem 1.25rem",
            gap: "1.5rem",
          }}
        >
          {/* Brand Logo: Haven Tech */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              textDecoration: "none",
            }}
          >
            {/* Elegant Gold 'H' Seal */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                border: "1.5px solid #C29B63",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(194, 155, 99, 0.15) 0%, rgba(10, 14, 22, 0.8) 100%)",
                boxShadow: "0 0 16px rgba(194, 155, 99, 0.18)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#DFC5A0",
                  lineHeight: 1,
                }}
              >
                H
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#FFFFFF",
                  lineHeight: 1.05,
                }}
              >
                HAVEN
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.3em",
                  color: "#C29B63",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                PREMIUM TECH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <Link
              href="/catalog"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: pathname === "/catalog" ? "#DFC5A0" : "#CBD5E1",
                transition: "color 0.2s ease",
              }}
            >
              Каталог
            </Link>
            <Link
              href="/catalog?category=smartphones"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#CBD5E1",
                transition: "color 0.2s ease",
              }}
            >
              Смартфоны
            </Link>
            <Link
              href="/catalog?category=laptops"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#CBD5E1",
                transition: "color 0.2s ease",
              }}
            >
              Ноутбуки & ПК
            </Link>
            <Link
              href="/catalog?category=tv-audio"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#CBD5E1",
                transition: "color 0.2s ease",
              }}
            >
              ТВ & Аудио
            </Link>
            <Link
              href="/about"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#CBD5E1",
                transition: "color 0.2s ease",
              }}
            >
              О компании
            </Link>
          </nav>

          {/* Right Header Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-icon"
              aria-label="Поиск техники"
              title="Поиск техники"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: searchOpen ? "rgba(194, 155, 99, 0.15)" : "rgba(255, 255, 255, 0.05)",
                borderColor: searchOpen ? "#C29B63" : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Search size={17} color={searchOpen ? "#DFC5A0" : "#CBD5E1"} />
            </button>

            {/* Favorites / Wishlist */}
            <Link href="/favorites">
              <button
                type="button"
                className="btn-icon"
                aria-label="Избранное"
                title="Избранное"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  position: "relative",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Heart size={17} color="#CBD5E1" />
                {effectiveFavCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      background: "#C29B63",
                      color: "#06080D",
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      width: 17,
                      height: 17,
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

            {/* Cart */}
            <Link href="/cart">
              <button
                type="button"
                className="btn-icon"
                aria-label="Корзина"
                title="Корзина"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  position: "relative",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <ShoppingBag size={17} color="#CBD5E1" />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      background: "#DFC5A0",
                      color: "#06080D",
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      width: 17,
                      height: 17,
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

            {/* Account */}
            <Link href="/account" className="hide-mobile">
              <button
                type="button"
                className="btn-icon"
                aria-label="Кабинет"
                title="Личный кабинет"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <User size={17} color="#CBD5E1" />
              </button>
            </Link>

            {/* Primary Action Button: Consultation / Tech Advisor */}
            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="btn btn-primary hide-mobile"
              style={{
                background: "#C29B63",
                color: "#0B0F17",
                padding: "0.6rem 1.35rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                boxShadow: "0 4px 18px rgba(194, 155, 99, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span>Консультация эксперта</span>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowRight size={13} color="#0B0F17" />
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className="btn-icon mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Открыть меню"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div
            style={{
              padding: "1rem 1.25rem 1.5rem",
              background: "rgba(8, 12, 19, 0.96)",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              borderBottom: "1px solid rgba(194, 155, 99, 0.25)",
              animation: "fadeIn 0.25s ease-out",
            }}
          >
            <div className="container" style={{ maxWidth: "760px" }}>
              <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#C29B63",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Поиск по технике: iPhone 16 Pro, MacBook M4, Galaxy S25, PlayStation 5, Dyson..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.85rem",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      fontSize: "0.9375rem",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: "#C29B63",
                    color: "#06080D",
                    borderRadius: "9999px",
                    padding: "0 1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Найти
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(6, 8, 13, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  border: "1.5px solid #C29B63",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(194, 155, 99, 0.1)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "#DFC5A0",
                  }}
                >
                  H
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#FFFFFF",
                }}
              >
                HAVEN ELECTRONICS
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-icon"
              aria-label="Закрыть меню"
              style={{ borderRadius: "50%" }}
            >
              <X size={22} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Link
              href="/catalog"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem",
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "0.75rem",
              }}
            >
              Каталог товаров
            </Link>
            <Link
              href="/catalog?category=smartphones"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem",
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "0.75rem",
              }}
            >
              Смартфоны & Гаджеты
            </Link>
            <Link
              href="/catalog?category=laptops"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem",
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "0.75rem",
              }}
            >
              Ноутбуки & Компьютеры
            </Link>
            <Link
              href="/catalog?category=tv-audio"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem",
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "0.75rem",
              }}
            >
              Телевизоры & Аудио
            </Link>
            <Link
              href="/about"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem",
                color: "#FFFFFF",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "0.75rem",
              }}
            >
              О магазине
            </Link>
          </nav>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setConsultModalOpen(true);
              }}
              className="btn btn-primary"
              style={{
                background: "#C29B63",
                color: "#06080D",
                borderRadius: "9999px",
                padding: "0.95rem",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Консультация эксперта <ArrowRight size={16} />
            </button>
            <Link href="/account" style={{ textAlign: "center", color: "#CBD5E1", fontSize: "0.9375rem" }}>
              Личный кабинет
            </Link>
          </div>
        </div>
      )}

      {/* Book a Consultation Modal */}
      {consultModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(4, 6, 10, 0.82)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setConsultModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "rgba(14, 20, 32, 0.95)",
              border: "1px solid rgba(194, 155, 99, 0.35)",
              borderRadius: "24px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(194, 155, 99, 0.15)",
              padding: "2.5rem 2rem",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setConsultModalOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                color: "#CBD5E1",
                background: "rgba(255, 255, 255, 0.05)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>

            {consultSent ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <CheckCircle2 size={54} color="#C29B63" style={{ margin: "0 auto 1.25rem" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.85rem",
                    color: "#FFFFFF",
                    marginBottom: "0.5rem",
                  }}
                >
                  Заявка принята
                </h3>
                <p style={{ color: "#CBD5E1", fontSize: "0.9375rem" }}>
                  Наш эксперт свяжется с вами в течение 15 минут для консультации по выбору техники и оформлению.
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.18em",
                      color: "#C29B63",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "0.35rem",
                    }}
                  >
                    ПЕРСОНАЛЬНЫЙ СЕРВИС
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.75rem",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    Консультация по подбору техники
                  </h3>
                  <p style={{ color: "#8E9BAE", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Поможем выбрать оптимальную конфигурацию, оформить рассрочку или корпоративный заказ.
                  </p>
                </div>

                <form onSubmit={handleConsultSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8125rem", color: "#CBD5E1", display: "block", marginBottom: "0.4rem" }}>
                      Ваше имя
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Например: Алишер"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#FFFFFF",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8125rem", color: "#CBD5E1", display: "block", marginBottom: "0.4rem" }}>
                      Номер телефона
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="+998 90 123 45 67"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#FFFFFF",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.8125rem", color: "#CBD5E1", display: "block", marginBottom: "0.4rem" }}>
                      Интересующая категория
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        background: "#0E1422",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#FFFFFF",
                        outline: "none",
                      }}
                    >
                      <option value="smartphones">Смартфоны (Apple iPhone, Samsung, Xiaomi)</option>
                      <option value="laptops">Ноутбуки (MacBook M4, ASUS ROG, Dell XPS)</option>
                      <option value="tv">OLED Телевизоры и Hi-Fi акустика</option>
                      <option value="gaming">PlayStation 5 Pro & гейминг</option>
                      <option value="credit">Оформление рассрочки без переплат</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      background: "#C29B63",
                      color: "#06080D",
                      borderRadius: "9999px",
                      padding: "0.85rem",
                      fontWeight: 600,
                      marginTop: "0.5rem",
                    }}
                  >
                    Заказать звонок эксперта <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

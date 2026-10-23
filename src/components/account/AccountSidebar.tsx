"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Shield,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";

interface AccountSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
  };
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch {
      window.location.href = "/auth/login";
    }
  };

  const navItems = [
    { label: "Обзор аккаунта", href: "/account", icon: LayoutDashboard },
    { label: "Личные данные", href: "/account/profile", icon: User },
    { label: "Мои заказы", href: "/account/orders", icon: Package },
    { label: "Адресная книга", href: "/account/addresses", icon: MapPin },
    { label: "Безопасность", href: "/account/security", icon: Shield },
  ];

  return (
    <aside
      style={{
        width: "280px",
        flexShrink: 0,
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-xl)",
        padding: "1.75rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* User profile card */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
          alt={user.name}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--accent-cyan)",
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.name}
          </h4>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.email}
          </span>
          {user.role === "ADMIN" && (
            <span style={{ display: "inline-block", background: "rgba(138, 43, 226, 0.2)", color: "#B388FF", fontSize: "0.6875rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "4px", marginTop: "0.25rem" }}>
              Администратор
            </span>
          )}
        </div>
      </div>

      {/* Navigation links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-surface)" : "transparent",
                transition: "all var(--transition-fast)",
              }}
            >
              <Icon size={18} color={isActive ? "var(--accent-cyan)" : "var(--text-muted)"} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#B388FF",
              background: "rgba(138, 43, 226, 0.1)",
              marginTop: "0.5rem",
            }}
          >
            <ShieldAlert size={18} color="#B388FF" />
            <span>Панель управления</span>
          </Link>
        )}
      </nav>

      {/* Logout button */}
      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 1rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-danger)",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <LogOut size={18} />
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </aside>
  );
};

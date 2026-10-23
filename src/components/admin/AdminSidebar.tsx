"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";

interface AdminSidebarProps {
  adminEmail: string;
  adminName: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ adminEmail, adminName }) => {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Обзор и статистика", icon: LayoutDashboard },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/categories", label: "Категории", icon: Layers },
    { href: "/admin/orders", label: "Заказы", icon: ShoppingBag },
    { href: "/admin/promotions", label: "Баннеры и акции", icon: Sparkles },
    { href: "/admin/audit", label: "Журнал аудита", icon: ShieldAlert },
  ];

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <div style={{ padding: "0 0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span
            style={{
              padding: "0.2rem 0.5rem",
              background: "rgba(255, 70, 70, 0.15)",
              color: "var(--accent-coral)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Admin Panel
          </span>
        </div>
        <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#FFF" }}>{adminName}</h3>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{adminEmail}</p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 0.85rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#FFF" : "var(--text-secondary)",
                background: isActive ? "var(--bg-surface)" : "transparent",
                border: isActive ? "1px solid var(--border-hover)" : "1px solid transparent",
                transition: "all var(--transition-fast)",
              }}
            >
              <Icon size={18} color={isActive ? "var(--accent-cyan)" : "currentColor"} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.85rem",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={16} /> На сайт магазина
        </Link>
      </div>
    </aside>
  );
};

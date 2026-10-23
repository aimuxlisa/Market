"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

export const SortDropdown: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "featured";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", val);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <ArrowUpDown size={16} color="var(--text-muted)" />
      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Сортировка:
      </span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="select"
        style={{
          width: "auto",
          padding: "0.45rem 1rem",
          fontSize: "0.875rem",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-card)",
          cursor: "pointer",
        }}
      >
        <option value="featured">Рекомендуемые</option>
        <option value="price_asc">Сначала дешевле</option>
        <option value="price_desc">Сначала дороже</option>
        <option value="rating">По рейтингу</option>
        <option value="newest">Новинки</option>
      </select>
    </div>
  );
};

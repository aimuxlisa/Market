import React from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminPromotionsClient } from "@/components/admin/AdminPromotionsClient";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/auth/login?returnUrl=/admin/promotions");
  }

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "2.5rem 0 5rem" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <AdminSidebar adminEmail={admin.email} adminName={admin.name} />

            <div style={{ flex: 1, minWidth: "320px" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFF", letterSpacing: "-0.02em" }}>
                  Баннеры и акции главной страницы
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  Управление рекламными карточками и промо-кампаниями
                </p>
              </div>

              <AdminPromotionsClient />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

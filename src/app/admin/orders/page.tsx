import React from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/auth/login?returnUrl=/admin/orders");
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
                  Управление заказами
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  Просмотр деталей заказов, смена статусов доставки и подтверждение платежей
                </p>
              </div>

              <AdminOrdersClient />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

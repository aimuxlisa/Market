import React from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { ProfileEditForm } from "@/components/account/ProfileEditForm";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <Header />

      <main className="main-content" style={{ padding: "2rem 0 5rem" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <AccountSidebar user={user} />

            <div style={{ flex: 1, minWidth: "300px" }}>
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2.5rem 2rem",
                }}
              >
                <div style={{ marginBottom: "2rem" }}>
                  <h1 className="font-display" style={{ fontSize: "1.65rem", fontWeight: 800, color: "#FFF", marginBottom: "0.5rem" }}>
                    Личные данные
                  </h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Управление именем, номером телефона и аватаром профиля
                  </p>
                </div>

                <ProfileEditForm user={user} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

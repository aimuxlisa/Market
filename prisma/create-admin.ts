import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || "admin@nexora.uz";
  const password = args[1] || process.env.ADMIN_PASSWORD || "AdminPassword2026!";
  const name = args[2] || "Главный Администратор Nexora";

  console.log(`🔐 Creating or verifying administrator account for: ${email}`);

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      passwordHash,
      name,
    },
    create: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      actor: "CLI_SEED",
      action: "CREATE_ADMIN",
      entity: "User",
      entityId: admin.id,
      metadata: JSON.stringify({ email: admin.email, name: admin.name }),
    },
  });

  console.log("✅ Administrator account is ready!");
  console.log(`📧 Email: ${admin.email}`);
  console.log(`👑 Role: ${admin.role}`);
  console.log(`🆔 ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

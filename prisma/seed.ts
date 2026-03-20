import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Plans ──────────────────────────────────────────────────────────────────
  const freePlan = await prisma.plan.upsert({
    where: { name: "Free" },
    update: {},
    create: {
      name: "Free",
      planType: "FREE",
      maxShops: 1,
      maxItems: 25,
      maxCategories: 3,
      maxCollections: 2,
      analyticsEnabled: false,
      pdfExportEnabled: false,
      watermarkEnabled: true,
      customBranding: false,
    },
  });

  const paidPlan = await prisma.plan.upsert({
    where: { name: "Paid Monthly" },
    update: {},
    create: {
      name: "Paid Monthly",
      planType: "PAID_MONTHLY",
      maxShops: 3,
      maxItems: 500,
      maxCategories: -1,
      maxCollections: -1,
      analyticsEnabled: true,
      pdfExportEnabled: true,
      watermarkEnabled: false,
      customBranding: true,
    },
  });

  console.log("✅ Plans created:", freePlan.name, "|", paidPlan.name);

  // ─── Super Admin ─────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@digidukan.com";
  const adminRawPassword = process.env.ADMIN_PASSWORD ?? "Admin@1234";
  if (!adminRawPassword) {
    throw new Error("ADMIN_PASSWORD env var is required for seeding. Set it before running this script.");
  }
  const adminPassword = await bcrypt.hash(adminRawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super admin created:", admin.email);
  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

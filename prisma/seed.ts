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
  const adminEmail = "admin@digidukan.com";
  const adminPassword = await bcrypt.hash("admin123456", 12);

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

  // ─── Demo Owner (optional, for development) ──────────────────────────────────
  const demoEmail = "demo@digidukan.com";
  const demoPassword = await bcrypt.hash("demo123456", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: "Demo Owner",
      passwordHash: demoPassword,
      role: "OWNER",
    },
  });

  await prisma.ownerProfile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      onboardingStep: 0,
      onboardingDone: false,
    },
  });

  console.log("✅ Demo owner created:", demoUser.email);
  console.log("\n📋 Seed credentials:");
  console.log("  Admin:     admin@digidukan.com / admin123456");
  console.log("  Demo owner: demo@digidukan.com  / demo123456");
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

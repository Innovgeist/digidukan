"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  CreateShopSchema,
  UpdateShopSchema,
  ShopBrandingSchema,
  ShopBannerSchema,
  ShopSettingsSchema,
} from "@/lib/validations/shop";
import {
  canCreateShop,
  generateSlug,
  isSlugAvailable,
  getShopPlan,
} from "@/lib/plan";
import { revalidatePath } from "next/cache";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function requireOwner() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

async function requireShopOwner(shopId: string) {
  const ownerId = await requireOwner();
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== ownerId || shop.deletedAt)
    throw new Error("FORBIDDEN");
  return { ownerId, shop };
}

// ── Shop CRUD ─────────────────────────────────────────────────────────────────

export async function createShopAction(data: unknown) {
  const ownerId = await requireOwner();

  const parsed = CreateShopSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  const { name, slug, ...rest } = parsed.data;

  // Plan check
  const check = await canCreateShop(ownerId);
  if (!check.allowed)
    return {
      error: `Shop limit reached (${check.current}/${check.limit}). Upgrade your plan to add more shops.`,
    };

  // Slug availability
  if (!(await isSlugAvailable(slug)))
    return { error: "This URL is already taken. Try a different slug." };

  // Get FREE plan for new shop subscription
  const freePlan = await prisma.plan.findFirst({
    where: { planType: "FREE", isActive: true },
  });
  if (!freePlan)
    return { error: "No active plan found. Contact support." };

  const shop = await prisma.$transaction(async (tx) => {
    const newShop = await tx.shop.create({
      data: {
        ownerId,
        name,
        slug,
        ...rest,
        status: "DRAFT",
      },
    });

    // Create ShopBranding record
    await tx.shopBranding.create({
      data: { shopId: newShop.id },
    });

    // Assign FREE plan subscription
    await tx.shopSubscription.create({
      data: {
        shopId: newShop.id,
        planId: freePlan.id,
        isActive: true,
      },
    });

    return newShop;
  });

  revalidatePath("/dashboard");
  revalidatePath("/shops");
  return { success: true, shopId: shop.id, slug: shop.slug };
}

export async function updateShopAction(shopId: string, data: unknown) {
  const { shop } = await requireShopOwner(shopId);

  const parsed = UpdateShopSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  const { slug, ...rest } = parsed.data;

  // Check slug change
  let slugChanged = false;
  if (slug && slug !== shop.slug) {
    if (!(await isSlugAvailable(slug, shopId)))
      return { error: "This URL is already taken." };
    slugChanged = true;
  }

  const updated = await prisma.shop.update({
    where: { id: shopId },
    data: { ...(slug ? { slug } : {}), ...rest },
  });

  // If slug changed, invalidate QR
  if (slugChanged) {
    await prisma.qRCodeAsset.deleteMany({ where: { shopId } });
  }

  revalidatePath(`/shops/${shopId}`);
  revalidatePath(`/s/${updated.slug}`);
  return { success: true, slugChanged };
}

export async function updateShopBrandingAction(shopId: string, data: unknown) {
  await requireShopOwner(shopId);

  const parsed = ShopBrandingSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  await prisma.shopBranding.upsert({
    where: { shopId },
    update: parsed.data,
    create: { shopId, ...parsed.data },
  });

  revalidatePath(`/shops/${shopId}`);
  return { success: true };
}

export async function updateShopSettingsAction(shopId: string, data: unknown) {
  await requireShopOwner(shopId);

  const parsed = ShopSettingsSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  await prisma.shop.update({
    where: { id: shopId },
    data: parsed.data,
  });

  revalidatePath(`/shops/${shopId}`);
  return { success: true };
}

export async function upsertShopBannerAction(shopId: string, data: unknown) {
  await requireShopOwner(shopId);

  const parsed = ShopBannerSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  const { expiresAt, ...rest } = parsed.data;

  await prisma.shopBanner.upsert({
    where: { shopId },
    update: {
      ...rest,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    create: {
      shopId,
      ...rest,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath(`/shops/${shopId}`);
  return { success: true };
}

// ── Publish / Unpublish ───────────────────────────────────────────────────────

export async function publishShopAction(shopId: string) {
  const { shop } = await requireShopOwner(shopId);

  // Precondition checks
  const categoryCount = await prisma.category.count({
    where: { shopId, deletedAt: null, isActive: true },
  });
  const itemCount = await prisma.item.count({
    where: { shopId, deletedAt: null },
  });
  const sub = await prisma.shopSubscription.findUnique({
    where: { shopId, isActive: true },
  });

  const errors: string[] = [];
  if (!shop.name) errors.push("Shop name is required");
  if (!shop.slug) errors.push("Shop URL (slug) is required");
  if (!shop.whatsappNumber && !shop.phone)
    errors.push("At least one contact (phone or WhatsApp) is required");
  if (categoryCount < 1) errors.push("At least 1 category is required");
  if (itemCount < 1) errors.push("At least 1 item is required");
  if (!sub) errors.push("No active subscription found");

  if (errors.length > 0) return { error: errors.join(" · ") };

  await prisma.shop.update({
    where: { id: shopId },
    data: { status: "PUBLISHED", lastPublishedAt: new Date() },
  });

  revalidatePath(`/shops/${shopId}`);
  revalidatePath(`/s/${shop.slug}`);
  return { success: true };
}

export async function unpublishShopAction(shopId: string) {
  const { shop } = await requireShopOwner(shopId);

  await prisma.shop.update({
    where: { id: shopId },
    data: { status: "DRAFT" },
  });

  revalidatePath(`/shops/${shopId}`);
  revalidatePath(`/s/${shop.slug}`);
  return { success: true };
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export async function advanceOnboardingStep(step: number) {
  const ownerId = await requireOwner();
  await prisma.ownerProfile.upsert({
    where: { userId: ownerId },
    update: {
      onboardingStep: step,
      onboardingDone: step >= 7,
    },
    create: {
      userId: ownerId,
      onboardingStep: step,
      onboardingDone: step >= 7,
    },
  });
  return { success: true };
}

export async function checkSlugAction(slug: string, excludeShopId?: string) {
  const available = await isSlugAvailable(slug, excludeShopId);
  return { available };
}

export async function generateSlugAction(name: string) {
  let slug = generateSlug(name);
  // If taken, append random suffix
  if (!(await isSlugAvailable(slug))) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return { slug };
}

// ── Plan info ─────────────────────────────────────────────────────────────────

export async function getShopPlanLimitsAction(shopId: string) {
  await requireShopOwner(shopId);
  const plan = await getShopPlan(shopId);
  const [itemCount, categoryCount, collectionCount] = await Promise.all([
    prisma.item.count({ where: { shopId, deletedAt: null } }),
    prisma.category.count({ where: { shopId, deletedAt: null } }),
    prisma.collection.count({ where: { shopId, deletedAt: null } }),
  ]);
  return {
    plan: {
      name: (plan as { name?: string }).name ?? "Free",
      maxItems: plan.maxItems,
      maxCategories: plan.maxCategories,
      maxCollections: plan.maxCollections,
      analyticsEnabled: plan.analyticsEnabled,
      watermarkEnabled: plan.watermarkEnabled,
    },
    usage: { itemCount, categoryCount, collectionCount },
  };
}

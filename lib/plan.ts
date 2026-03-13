import { prisma } from "@/lib/db";
import type { Plan } from "@prisma/client";

// Default FREE plan fallback (used before DB is seeded or if subscription missing)
const DEFAULT_FREE_LIMITS = {
  maxShops: 1,
  maxItems: 25,
  maxCategories: 3,
  maxCollections: 2,
  analyticsEnabled: false,
  pdfExportEnabled: false,
  watermarkEnabled: true,
  customBranding: false,
};

/** Get the active plan for a specific shop */
export async function getShopPlan(shopId: string): Promise<Plan | typeof DEFAULT_FREE_LIMITS> {
  const sub = await prisma.shopSubscription.findUnique({
    where: { shopId, isActive: true },
    include: { plan: true },
  });
  return sub?.plan ?? (DEFAULT_FREE_LIMITS as unknown as Plan);
}

/** Get the best effective plan across all owner's shops (used for shop creation limit) */
export async function getOwnerEffectivePlan(
  ownerId: string
): Promise<Plan | typeof DEFAULT_FREE_LIMITS> {
  const subs = await prisma.shopSubscription.findMany({
    where: {
      shop: { ownerId },
      isActive: true,
    },
    include: { plan: true },
    orderBy: { plan: { maxItems: "desc" } }, // highest plan first
  });
  return subs[0]?.plan ?? (DEFAULT_FREE_LIMITS as unknown as Plan);
}

/** Check if owner can create another shop */
export async function canCreateShop(ownerId: string): Promise<{ allowed: boolean; limit: number; current: number }> {
  const plan = await getOwnerEffectivePlan(ownerId);
  const current = await prisma.shop.count({ where: { ownerId, deletedAt: null } });
  const limit = plan.maxShops;
  return { allowed: limit === -1 || current < limit, limit, current };
}

/** Check if shop can add more items */
export async function canAddItem(shopId: string): Promise<{ allowed: boolean; limit: number; current: number }> {
  const plan = await getShopPlan(shopId);
  const current = await prisma.item.count({ where: { shopId, deletedAt: null } });
  const limit = plan.maxItems;
  return { allowed: limit === -1 || current < limit, limit, current };
}

/** Check if shop can add more categories */
export async function canAddCategory(shopId: string): Promise<{ allowed: boolean; limit: number; current: number }> {
  const plan = await getShopPlan(shopId);
  const current = await prisma.category.count({ where: { shopId, deletedAt: null } });
  const limit = plan.maxCategories;
  return { allowed: limit === -1 || current < limit, limit, current };
}

/** Check if shop can add more collections */
export async function canAddCollection(shopId: string): Promise<{ allowed: boolean; limit: number; current: number }> {
  const plan = await getShopPlan(shopId);
  const current = await prisma.collection.count({ where: { shopId, deletedAt: null } });
  const limit = plan.maxCollections;
  return { allowed: limit === -1 || current < limit, limit, current };
}

/** Generate a URL-safe slug from a name */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/** Check if a shop slug is available (excluding a specific shopId for edits) */
export async function isSlugAvailable(slug: string, excludeShopId?: string): Promise<boolean> {
  const existing = await prisma.shop.findUnique({ where: { slug } });
  if (!existing) return true;
  if (excludeShopId && existing.id === excludeShopId) return true;
  return false;
}

export function isFeatureAllowed(
  plan: Plan | typeof DEFAULT_FREE_LIMITS,
  feature: "analytics" | "pdf_export" | "no_watermark" | "custom_branding"
): boolean {
  switch (feature) {
    case "analytics": return plan.analyticsEnabled;
    case "pdf_export": return plan.pdfExportEnabled;
    case "no_watermark": return !plan.watermarkEnabled;
    case "custom_branding": return plan.customBranding;
    default: return false;
  }
}

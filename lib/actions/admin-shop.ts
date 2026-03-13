"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session.user.id;
}

export async function createShopForOwnerAction(data: {
  name: string;
  slug: string;
  ownerId: string;
  description?: string;
  status: "DRAFT" | "PUBLISHED";
}): Promise<{ success: true; shopId: string } | { error: string }> {
  const adminId = await requireAdmin();

  if (!data.name?.trim()) return { error: "Shop name is required." };
  if (!data.slug?.trim()) return { error: "Slug is required." };
  if (!data.ownerId?.trim()) return { error: "Owner is required." };

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    return { error: "Slug may only contain lowercase letters, numbers, and hyphens." };
  }

  // Check slug uniqueness
  const existingSlug = await prisma.shop.findUnique({ where: { slug: data.slug } });
  if (existingSlug) return { error: "A shop with this slug already exists." };

  // Verify owner exists
  const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
  if (!owner || owner.role !== "OWNER") return { error: "Owner not found." };

  // Get free plan to connect on creation
  const freePlan = await prisma.plan.findFirst({
    where: { planType: "FREE", isActive: true },
  });

  // Create shop — phone and whatsappNumber are required in schema; use empty string as default
  const shop = await prisma.shop.create({
    data: {
      ownerId: data.ownerId,
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: data.description?.trim() ?? null,
      status: data.status,
      phone: "",
      whatsappNumber: "",
      ...(freePlan
        ? {
            subscription: {
              create: {
                planId: freePlan.id,
                isActive: true,
                startsAt: new Date(),
                endsAt: null,
                grantedByAdminId: adminId,
              },
            },
          }
        : {}),
    },
    select: { id: true },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "CREATE_SHOP_FOR_OWNER",
      targetType: "Shop",
      targetId: shop.id,
      metadata: {
        ownerId: data.ownerId,
        ownerEmail: owner.email,
        slug: data.slug,
        status: data.status,
        planId: freePlan?.id ?? null,
      },
    },
  });

  revalidatePath("/admin/shops");
  return { success: true, shopId: shop.id };
}

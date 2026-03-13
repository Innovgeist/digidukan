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

export async function grantTrialAction(
  shopId: string,
  data: { durationDays: number; notes?: string }
) {
  const adminId = await requireAdmin();

  // Find PAID_MONTHLY plan
  const paidPlan = await prisma.plan.findFirst({
    where: { planType: "PAID_MONTHLY", isActive: true },
  });
  if (!paidPlan) return { error: "No active PAID_MONTHLY plan found." };

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.deletedAt) return { error: "Shop not found." };

  const startsAt = new Date();
  const endsAt = new Date(
    startsAt.getTime() + data.durationDays * 24 * 60 * 60 * 1000
  );

  // Upsert subscription to PAID plan
  await prisma.shopSubscription.upsert({
    where: { shopId },
    update: {
      planId: paidPlan.id,
      startsAt,
      endsAt,
      isActive: true,
      grantedByAdminId: adminId,
      notes: data.notes ?? null,
    },
    create: {
      shopId,
      planId: paidPlan.id,
      startsAt,
      endsAt,
      isActive: true,
      grantedByAdminId: adminId,
      notes: data.notes ?? null,
    },
  });

  // Log action
  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "GRANT_TRIAL",
      targetType: "Shop",
      targetId: shopId,
      metadata: { durationDays: data.durationDays, notes: data.notes, planId: paidPlan.id },
    },
  });

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/admin/shops`);
  return { success: true };
}

export async function suspendShopAction(shopId: string) {
  const adminId = await requireAdmin();

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.deletedAt) return { error: "Shop not found." };

  await prisma.shop.update({
    where: { id: shopId },
    data: { status: "SUSPENDED" },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "SUSPEND_SHOP",
      targetType: "Shop",
      targetId: shopId,
      metadata: { previousStatus: shop.status },
    },
  });

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/admin/shops`);
  return { success: true };
}

export async function unsuspendShopAction(shopId: string) {
  const adminId = await requireAdmin();

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.deletedAt) return { error: "Shop not found." };

  await prisma.shop.update({
    where: { id: shopId },
    data: { status: "DRAFT" },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "UNSUSPEND_SHOP",
      targetType: "Shop",
      targetId: shopId,
    },
  });

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/admin/shops`);
  return { success: true };
}

export async function archiveShopAction(shopId: string) {
  const adminId = await requireAdmin();

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.deletedAt) return { error: "Shop not found." };

  await prisma.shop.update({
    where: { id: shopId },
    data: { status: "ARCHIVED" },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "ARCHIVE_SHOP",
      targetType: "Shop",
      targetId: shopId,
      metadata: { previousStatus: shop.status },
    },
  });

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/admin/shops`);
  return { success: true };
}

export async function publishShopAction(shopId: string) {
  const adminId = await requireAdmin();

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.deletedAt) return { error: "Shop not found." };

  await prisma.shop.update({
    where: { id: shopId },
    data: { status: "PUBLISHED", lastPublishedAt: new Date() },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "PUBLISH_SHOP",
      targetType: "Shop",
      targetId: shopId,
      metadata: { previousStatus: shop.status },
    },
  });

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/admin/shops`);
  return { success: true };
}

export async function assignPlanAction(shopId: string, planId: string) {
  const adminId = await requireAdmin();

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.deletedAt) return { error: "Shop not found." };

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) return { error: "Plan not found or inactive." };

  const startsAt = new Date();

  await prisma.shopSubscription.upsert({
    where: { shopId },
    update: {
      planId,
      isActive: true,
      startsAt,
      endsAt: null,
      grantedByAdminId: adminId,
    },
    create: {
      shopId,
      planId,
      isActive: true,
      startsAt,
      endsAt: null,
      grantedByAdminId: adminId,
    },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "ASSIGN_PLAN",
      targetType: "Shop",
      targetId: shopId,
      metadata: { planId, planName: plan.name },
    },
  });

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/admin/shops`);
  return { success: true };
}

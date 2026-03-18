"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface FeatureFlag {
  id: string;
  key: string;
  description: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session.user.id;
}

async function logAdminAction(
  adminId: string,
  action: string,
  targetId: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.adminActionLog.create({
      data: {
        adminId,
        action,
        targetType: "FeatureFlag",
        targetId,
        metadata: metadata as any,
      },
    });
  } catch {
    // Non-fatal
  }
}

export async function getAllFlagsAction(): Promise<FeatureFlag[]> {
  await requireAdmin();
  const flags = await prisma.featureFlag.findMany({ orderBy: { createdAt: "asc" } });
  return flags.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));
}

export async function createFlagAction(data: {
  key: string;
  description?: string;
  isEnabled: boolean;
}): Promise<{ success: true; flag: FeatureFlag } | { error: string }> {
  const adminId = await requireAdmin();

  if (!data.key?.trim()) {
    return { error: "Flag key is required." };
  }

  const keyNormalized = data.key.trim().toLowerCase().replace(/\s+/g, "_");

  const existing = await prisma.featureFlag.findUnique({ where: { key: keyNormalized } });
  if (existing) {
    return { error: `A flag with key "${keyNormalized}" already exists.` };
  }

  const flag = await prisma.featureFlag.create({
    data: {
      key: keyNormalized,
      description: data.description?.trim() ?? "",
      isEnabled: data.isEnabled,
    },
  });

  await logAdminAction(adminId, "CREATE_FEATURE_FLAG", flag.id, {
    key: flag.key,
    isEnabled: flag.isEnabled,
  });

  revalidatePath("/admin/flags");
  return {
    success: true,
    flag: { ...flag, createdAt: flag.createdAt.toISOString(), updatedAt: flag.updatedAt.toISOString() },
  };
}

export async function toggleFlagAction(
  flagId: string
): Promise<{ success: true; flag: FeatureFlag } | { error: string }> {
  const adminId = await requireAdmin();

  const existing = await prisma.featureFlag.findUnique({ where: { id: flagId } });
  if (!existing) {
    return { error: "Flag not found." };
  }

  const flag = await prisma.featureFlag.update({
    where: { id: flagId },
    data: { isEnabled: !existing.isEnabled },
  });

  await logAdminAction(adminId, "TOGGLE_FEATURE_FLAG", flagId, {
    key: flag.key,
    isEnabled: flag.isEnabled,
  });

  revalidatePath("/admin/flags");
  return {
    success: true,
    flag: { ...flag, createdAt: flag.createdAt.toISOString(), updatedAt: flag.updatedAt.toISOString() },
  };
}

export async function deleteFlagAction(
  flagId: string
): Promise<{ success: true } | { error: string }> {
  const adminId = await requireAdmin();

  const existing = await prisma.featureFlag.findUnique({ where: { id: flagId } });
  if (!existing) {
    return { error: "Flag not found." };
  }

  await prisma.featureFlag.delete({ where: { id: flagId } });

  await logAdminAction(adminId, "DELETE_FEATURE_FLAG", flagId, { key: existing.key });

  revalidatePath("/admin/flags");
  return { success: true };
}

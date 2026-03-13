"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// FeatureFlag is not in the Prisma schema, so we use a JSON file for persistence.
// The file lives at <project-root>/data/feature-flags.json

export interface FeatureFlag {
  id: string;
  key: string;
  description: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FLAGS_FILE = path.join(DATA_DIR, "feature-flags.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readFlags(): FeatureFlag[] {
  ensureDataDir();
  if (!fs.existsSync(FLAGS_FILE)) return [];
  try {
    const raw = fs.readFileSync(FLAGS_FILE, "utf-8");
    return JSON.parse(raw) as FeatureFlag[];
  } catch {
    return [];
  }
}

function writeFlags(flags: FeatureFlag[]) {
  ensureDataDir();
  fs.writeFileSync(FLAGS_FILE, JSON.stringify(flags, null, 2), "utf-8");
}

function generateId(): string {
  return `flag_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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
    // Non-fatal — flag ops still succeed even if logging fails
  }
}

export async function getAllFlagsAction(): Promise<FeatureFlag[]> {
  await requireAdmin();
  return readFlags();
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

  const flags = readFlags();
  const keyNormalized = data.key.trim().toLowerCase().replace(/\s+/g, "_");

  if (flags.some((f) => f.key === keyNormalized)) {
    return { error: `A flag with key "${keyNormalized}" already exists.` };
  }

  const now = new Date().toISOString();
  const newFlag: FeatureFlag = {
    id: generateId(),
    key: keyNormalized,
    description: data.description?.trim() ?? "",
    isEnabled: data.isEnabled,
    createdAt: now,
    updatedAt: now,
  };

  flags.push(newFlag);
  writeFlags(flags);

  await logAdminAction(adminId, "CREATE_FEATURE_FLAG", newFlag.id, {
    key: newFlag.key,
    isEnabled: newFlag.isEnabled,
  });

  revalidatePath("/admin/flags");
  return { success: true, flag: newFlag };
}

export async function toggleFlagAction(
  flagId: string
): Promise<{ success: true; flag: FeatureFlag } | { error: string }> {
  const adminId = await requireAdmin();

  const flags = readFlags();
  const index = flags.findIndex((f) => f.id === flagId);
  if (index === -1) {
    return { error: "Flag not found." };
  }

  flags[index].isEnabled = !flags[index].isEnabled;
  flags[index].updatedAt = new Date().toISOString();
  writeFlags(flags);

  await logAdminAction(adminId, "TOGGLE_FEATURE_FLAG", flagId, {
    key: flags[index].key,
    isEnabled: flags[index].isEnabled,
  });

  revalidatePath("/admin/flags");
  return { success: true, flag: flags[index] };
}

export async function deleteFlagAction(
  flagId: string
): Promise<{ success: true } | { error: string }> {
  const adminId = await requireAdmin();

  const flags = readFlags();
  const index = flags.findIndex((f) => f.id === flagId);
  if (index === -1) {
    return { error: "Flag not found." };
  }

  const deletedFlag = flags[index];
  flags.splice(index, 1);
  writeFlags(flags);

  await logAdminAction(adminId, "DELETE_FEATURE_FLAG", flagId, {
    key: deletedFlag.key,
  });

  revalidatePath("/admin/flags");
  return { success: true };
}

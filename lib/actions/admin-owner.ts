"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
  return session.user.id;
}

export async function createOwnerAction(data: {
  name: string;
  email: string;
  password: string;
}) {
  const adminId = await requireAdmin();

  if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) {
    return { error: "Name, email, and password are required." };
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { error: "An account with this email already exists." };

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const freePlan = await prisma.plan.findFirst({ where: { planType: "FREE", isActive: true } });

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role: "OWNER",
      },
    });
    await tx.ownerProfile.create({
      data: { userId: newUser.id, onboardingStep: 0, onboardingDone: false },
    });
    return newUser;
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "CREATE_OWNER",
      targetType: "User",
      targetId: user.id,
      metadata: { email: data.email },
    },
  });

  revalidatePath("/admin/owners");
  return { success: true, userId: user.id };
}

export async function suspendOwnerAction(userId: string) {
  const adminId = await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "OWNER") return { error: "Owner not found." };

  // Suspend all of owner's shops
  await prisma.shop.updateMany({
    where: { ownerId: userId, deletedAt: null, status: { not: "ARCHIVED" } },
    data: { status: "SUSPENDED" },
  });

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "SUSPEND_OWNER",
      targetType: "User",
      targetId: userId,
      metadata: { email: user.email },
    },
  });

  revalidatePath(`/admin/owners/${userId}`);
  revalidatePath("/admin/owners");
  return { success: true };
}

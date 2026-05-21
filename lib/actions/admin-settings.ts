"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setSignupCode } from "@/lib/settings";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session.user.id;
}

export async function updateSignupCodeAction(
  value: string
): Promise<{ success: true } | { error: string }> {
  const adminId = await requireAdmin();

  const trimmed = value.trim();
  if (trimmed.length < 4) {
    return { error: "Signup code must be at least 4 characters." };
  }
  if (trimmed.length > 64) {
    return { error: "Signup code must be at most 64 characters." };
  }

  await setSignupCode(trimmed);

  await prisma.adminActionLog.create({
    data: {
      adminId,
      action: "UPDATE_SIGNUP_CODE",
      targetType: "AppSetting",
      targetId: "signupCode",
      metadata: { length: trimmed.length },
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

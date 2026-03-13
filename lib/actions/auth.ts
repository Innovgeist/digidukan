"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { SignupSchema, LoginSchema } from "@/lib/validations/auth";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function signupAction(data: unknown) {
  const parsed = SignupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Get the FREE plan
  const freePlan = await prisma.plan.findFirst({
    where: { planType: "FREE", isActive: true },
  });

  if (!freePlan) {
    return { error: "System error: No active plan found. Contact support." };
  }

  // Create user + owner profile + first shop subscription in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "OWNER",
      },
    });

    await tx.ownerProfile.create({
      data: {
        userId: newUser.id,
        onboardingStep: 0,
        onboardingDone: false,
      },
    });

    return newUser;
  });

  return { success: true, userId: user.id };
}

export async function loginAction(data: unknown) {
  const parsed = LoginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}


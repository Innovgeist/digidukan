import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the caller is a SUPER_ADMIN
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminId = session.user.id;

    // 2. Parse request body
    let body: { targetUserId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { targetUserId } = body;
    if (!targetUserId || typeof targetUserId !== "string") {
      return NextResponse.json(
        { error: "targetUserId is required" },
        { status: 400 }
      );
    }

    // 3. Find target user — must exist and be OWNER (not SUPER_ADMIN)
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot impersonate a SUPER_ADMIN" },
        { status: 400 }
      );
    }

    if (targetUser.role !== "OWNER") {
      return NextResponse.json(
        { error: "Target user must be an OWNER" },
        { status: 400 }
      );
    }

    // 4. Prevent self-impersonation
    if (adminId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot impersonate yourself" },
        { status: 400 }
      );
    }

    // 5. Get client IP
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    // 6. Create SupportImpersonationLog record
    // Schema fields: adminId, targetOwnerId, reason, startedAt (default now), endedAt, isActive (default true)
    const log = await prisma.supportImpersonationLog.create({
      data: {
        adminId,
        targetOwnerId: targetUserId,
        reason: `Admin impersonation initiated from IP: ${ipAddress}`,
        isActive: true,
      },
    });

    // 7. Also log in AdminActionLog
    await prisma.adminActionLog.create({
      data: {
        adminId,
        action: "START_IMPERSONATION",
        targetType: "User",
        targetId: targetUserId,
        metadata: {
          targetEmail: targetUser.email,
          targetName: targetUser.name,
          impersonationLogId: log.id,
          ipAddress,
        },
      },
    });

    // 8. Set impersonation cookie
    const cookiePayload = JSON.stringify({
      targetUserId,
      logId: log.id,
      adminId,
      targetName: targetUser.name ?? targetUser.email,
    });

    const cookieStore = await cookies();
    cookieStore.set("digidukan_impersonate", cookiePayload, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 3600, // 1 hour
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[impersonation/start]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

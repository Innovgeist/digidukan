import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

interface ImpersonationCookiePayload {
  targetUserId: string;
  logId: string;
  adminId: string;
  targetName: string;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("digidukan_impersonate")?.value;

    if (!cookieValue) {
      // No active impersonation — just redirect
      return NextResponse.json({ success: true, redirectTo: "/admin" });
    }

    // Parse the cookie payload
    let payload: ImpersonationCookiePayload;
    try {
      payload = JSON.parse(cookieValue) as ImpersonationCookiePayload;
    } catch {
      // Malformed cookie — clear it and redirect
      cookieStore.delete("digidukan_impersonate");
      return NextResponse.json({ success: true, redirectTo: "/admin" });
    }

    // Update the SupportImpersonationLog to mark it as ended
    if (payload.logId) {
      try {
        await prisma.supportImpersonationLog.update({
          where: { id: payload.logId },
          data: {
            endedAt: new Date(),
            isActive: false,
          },
        });
      } catch {
        // Log update failure is non-fatal — we still clear the cookie
        console.error("[impersonation/end] Failed to update log:", payload.logId);
      }
    }

    // Log in AdminActionLog
    if (payload.adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId: payload.adminId,
            action: "END_IMPERSONATION",
            targetType: "User",
            targetId: payload.targetUserId ?? "unknown",
            metadata: {
              impersonationLogId: payload.logId,
              targetName: payload.targetName,
            },
          },
        });
      } catch {
        // Non-fatal
        console.error("[impersonation/end] Failed to write admin action log");
      }
    }

    // Delete the impersonation cookie
    cookieStore.delete("digidukan_impersonate");

    return NextResponse.json({ success: true, redirectTo: "/admin" });
  } catch (err) {
    console.error("[impersonation/end]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

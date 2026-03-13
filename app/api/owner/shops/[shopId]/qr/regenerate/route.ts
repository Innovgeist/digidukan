import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAndSaveQR } from "@/lib/qr";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: { id: true, slug: true, ownerId: true, deletedAt: true },
  });

  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  try {
    const qrUrl = await generateAndSaveQR(shopId, shop.slug);
    return NextResponse.json({ qrUrl });
  } catch (err) {
    console.error("QR regeneration error:", err);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}

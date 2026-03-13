import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_EVENTS = [
  "PAGE_VIEW",
  "QR_SCAN",
  "CALL_CLICK",
  "WHATSAPP_CLICK",
  "SHARE_CLICK",
  "MAP_CLICK",
  "CART_ADD",
  "ITEM_VIEW",
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const event = body.event as string;

    if (!VALID_EVENTS.includes(event)) {
      return NextResponse.json({ ok: true }); // silent ignore
    }

    const shop = await prisma.shop.findUnique({
      where: { slug, status: "PUBLISHED", deletedAt: null },
    });

    if (!shop) return NextResponse.json({ ok: true });

    await prisma.analyticsEvent.create({
      data: {
        shopId: shop.id,
        eventType: event as
          | "PAGE_VIEW"
          | "QR_SCAN"
          | "CALL_CLICK"
          | "WHATSAPP_CLICK"
          | "SHARE_CLICK"
          | "MAP_CLICK"
          | "CART_ADD"
          | "ITEM_VIEW",
        metadata: body.metadata ?? {},
      },
    });
  } catch {
    // Never throw — analytics must not break the storefront
  }
  return NextResponse.json({ ok: true });
}

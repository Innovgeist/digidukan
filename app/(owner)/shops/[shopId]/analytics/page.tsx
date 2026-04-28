import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { getShopPlan, isFeatureAllowed } from "@/lib/plan";
import { AnalyticsCard } from "@/components/owner/AnalyticsCard";
import { FeatureLock } from "@/components/owner/FeatureLock";
import Link from "next/link";
import { Eye, QrCode, MessageCircle, Phone, Share2, MapPin, ShoppingCart } from "lucide-react";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: { id: true, name: true, ownerId: true, deletedAt: true },
  });
  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt) notFound();

  const plan = await getShopPlan(shopId);
  const analyticsEnabled = isFeatureAllowed(plan, "analytics");
  const planName = (plan as { name?: string }).name ?? "Free";

  if (!analyticsEnabled) {
    return (
      <div className="p-6 lg:p-8">
        <Link href={`/shops/${shopId}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← {shop.name}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
        <FeatureLock feature="Analytics" planName={planName} />
      </div>
    );
  }

  // Fetch event counts for 7d and 30d
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [events7d, events30d] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { shopId, createdAt: { gte: sevenDaysAgo } },
      _count: { eventType: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { shopId, createdAt: { gte: thirtyDaysAgo } },
      _count: { eventType: true },
    }),
  ]);

  function getCount(
    events: { eventType: string; _count: { eventType: number } }[],
    type: string
  ): number {
    return events.find((e) => e.eventType === type)?._count.eventType ?? 0;
  }

  const metrics = [
    { icon: Eye, label: "Storefront Views", type: "PAGE_VIEW" },
    { icon: QrCode, label: "QR Scans", type: "QR_SCAN" },
    { icon: MessageCircle, label: "WhatsApp Orders", type: "WHATSAPP_CLICK" },
    { icon: Phone, label: "Call Clicks", type: "CALL_CLICK" },
    { icon: Share2, label: "Share Clicks", type: "SHARE_CLICK" },
    { icon: MapPin, label: "Map Clicks", type: "MAP_CLICK" },
    { icon: ShoppingCart, label: "Cart Adds", type: "CART_ADD" },
  ];

  const totalViews7d = getCount(events7d, "PAGE_VIEW");
  const totalViews30d = getCount(events30d, "PAGE_VIEW");

  return (
    <div className="p-6 lg:p-8">
      <Link href={`/shops/${shopId}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← {shop.name}
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {planName} plan
        </span>
      </div>

      {/* Summary */}
      <div className="bg-blue-600 text-white rounded-2xl p-5 mb-6">
        <p className="text-sm text-blue-100 mb-1">Total storefront views</p>
        <p className="text-4xl font-bold">{totalViews30d.toLocaleString()}</p>
        <p className="text-sm text-blue-200 mt-1">Last 30 days · {totalViews7d.toLocaleString()} in last 7 days</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.map((m) => (
          <AnalyticsCard
            key={m.type}
            icon={m.icon}
            label={m.label}
            count7d={getCount(events7d, m.type)}
            count30d={getCount(events30d, m.type)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Data refreshes in real-time. Events older than 90 days are archived.
      </p>
    </div>
  );
}

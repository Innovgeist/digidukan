import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { AdminShopActions } from "./AdminShopActions";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function AdminShopDetailPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      subscription: { include: { plan: true } },
      _count: {
        select: {
          items: { where: { deletedAt: null } },
          categories: { where: { deletedAt: null } },
          collections: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!shop || shop.deletedAt) notFound();

  // Fetch all active plans for assign-plan dropdown
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    select: { id: true, name: true, planType: true },
  });

  // Fetch current subscription to pre-select plan
  const subscription = await prisma.shopSubscription.findUnique({
    where: { shopId },
    select: { planId: true },
  });

  // Recent action logs for this shop
  const logs = await prisma.adminActionLog.findMany({
    where: { targetId: shopId, targetType: "Shop" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { admin: { select: { email: true } } },
  });

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <Link href="/admin/shops" className="text-sm text-gray-500 hover:text-gray-700 inline-block">
        ← All Shops
      </Link>

      {/* Shop Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{shop.name}</h1>
            <p className="text-sm text-gray-500">/s/{shop.slug}</p>
          </div>
          <StatusBadge status={shop.status} />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center border-t border-gray-100 pt-4">
          <div>
            <p className="text-xl font-bold text-gray-900">{shop._count.items}</p>
            <p className="text-xs text-gray-500">Items</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{shop._count.categories}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{shop._count.collections}</p>
            <p className="text-xs text-gray-500">Collections</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Current plan:</span>{" "}
            {shop.subscription?.plan.name ?? "Free"}
            {shop.subscription?.endsAt && (
              <span className="text-gray-400 ml-2">
                · Expires {new Date(shop.subscription.endsAt).toLocaleDateString("en-IN")}
              </span>
            )}
          </p>
          {shop.phone && <p className="text-sm text-gray-400 mt-1">📞 {shop.phone}</p>}
          {shop.whatsappNumber && <p className="text-sm text-gray-400">💬 {shop.whatsappNumber}</p>}
        </div>
      </div>

      {/* Admin actions */}
      <AdminShopActions
        shopId={shopId}
        shopStatus={shop.status}
        shopName={shop.name}
        currentPlanName={shop.subscription?.plan.name ?? "Free"}
        plans={plans}
        currentPlanId={subscription?.planId}
      />

      {/* Action logs */}
      {logs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Action History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{log.action.replace(/_/g, " ")}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">by {log.admin.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


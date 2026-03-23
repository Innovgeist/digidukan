import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, Package, Globe, Eye, ExternalLink, Settings } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.ownerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.onboardingDone) {
    redirect("/onboarding");
  }

  const shops = await prisma.shop.findMany({
    where: { ownerId: session.user.id, deletedAt: null },
    include: {
      _count: { select: { items: { where: { deletedAt: null } } } },
      subscription: { include: { plan: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const shopIds = shops.map((s) => s.id);

  const [totalItems, publishedCount, totalViews] = await Promise.all([
    prisma.item.count({
      where: { shopId: { in: shopIds }, deletedAt: null },
    }),
    prisma.shop.count({
      where: { id: { in: shopIds }, status: "PUBLISHED", deletedAt: null },
    }),
    prisma.analyticsEvent.count({
      where: { shopId: { in: shopIds }, eventType: "PAGE_VIEW" },
    }),
  ]);

  const stats = [
    { label: "Total Shops", value: shops.length, icon: Store, color: "text-blue-600 bg-blue-50" },
    { label: "Total Items", value: totalItems, icon: Package, color: "text-violet-600 bg-violet-50" },
    { label: "Published", value: publishedCount, icon: Globe, color: "text-green-600 bg-green-50" },
    { label: "Total Views", value: totalViews, icon: Eye, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <div className="flex justify-end mb-3">
          <Link
            href="/shops/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + New Shop
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {s.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shops */}
      {shops.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Store className="w-7 h-7 text-blue-600" />
          </div>
          <p className="text-gray-500 mb-4">You don&apos;t have any shops yet.</p>
          <Link
            href="/onboarding"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Set up your first shop
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Your Shops</h2>
          <div className="grid gap-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                    <StatusBadge status={shop.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    /s/{shop.slug} · {shop._count.items} items ·{" "}
                    {shop.subscription?.plan.name ?? "Free"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {shop.status === "PUBLISHED" && (
                    <Link
                      href={`/s/${shop.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </Link>
                  )}
                  <Link
                    href={`/shops/${shop.id}`}
                    className="inline-flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

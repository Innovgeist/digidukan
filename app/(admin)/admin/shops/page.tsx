import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowRight, Store } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function AdminShopsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const shops = await prisma.shop.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      subscription: { include: { plan: true } },
      owner: { select: { name: true, email: true } },
      _count: {
        select: {
          items: { where: { deletedAt: null } },
          categories: { where: { deletedAt: null } },
        },
      },
    },
  });

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface">
            All Shops
          </h1>
          <p className="text-base text-on-surface-variant mt-1">
            {shops.length} {shops.length === 1 ? "shop" : "shops"} across the platform
          </p>
        </div>
        <Link
          href="/admin/shops/new"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-[family-name:var(--font-inter)] text-sm font-medium hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" strokeWidth={2.4} />
          Create Shop
        </Link>
      </header>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-outline-variant/30 bg-surface-container-low font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          <div>Shop</div>
          <div className="w-32 text-center">Status</div>
          <div className="w-24 text-right">Items</div>
          <div className="w-24 text-right">Plan</div>
          <div className="w-20 text-right">Action</div>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {shops.map((shop, idx) => (
            <div
              key={shop.id}
              className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-surface-container-low transition-colors ${
                idx % 2 === 1 ? "bg-[#F1F5F9]/40" : ""
              }`}
            >
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-outline" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {shop.name}
                    </p>
                    {shop.isPremium && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-[family-name:var(--font-inter)] font-semibold uppercase tracking-wide">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant font-[family-name:var(--font-inter)] truncate">
                    /s/{shop.slug} · by {shop.owner.name ?? shop.owner.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1 sm:hidden">
                    <StatusBadge status={shop.status} />
                    <span className="text-xs text-on-surface-variant font-[family-name:var(--font-inter)]">
                      {shop._count.items} items ·{" "}
                      {shop.subscription?.plan.name ?? "Free"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex w-32 justify-center">
                <StatusBadge status={shop.status} />
              </div>
              <div className="hidden sm:block w-24 text-right text-sm font-semibold text-on-surface tabular-nums">
                {shop._count.items}
              </div>
              <div className="hidden sm:block w-24 text-right text-sm text-on-surface-variant font-[family-name:var(--font-inter)]">
                {shop.subscription?.plan.name ?? "Free"}
              </div>
              <Link
                href={`/admin/shops/${shop.id}`}
                className="w-20 text-right text-sm text-primary hover:underline font-medium font-[family-name:var(--font-inter)] inline-flex items-center justify-end gap-1"
              >
                Manage
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
              </Link>
            </div>
          ))}
          {shops.length === 0 && (
            <div className="px-5 py-12 text-center text-on-surface-variant text-sm">
              No shops found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

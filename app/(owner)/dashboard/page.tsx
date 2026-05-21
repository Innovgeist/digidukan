import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  Package,
  Globe,
  Eye,
  ExternalLink,
  Settings,
  Edit3,
  EyeOff,
  Plus,
  ArrowUp,
  Link2,
  Star,
} from "lucide-react";
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
      branding: true,
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

  function formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return n.toLocaleString();
  }

  const stats = [
    {
      label: "Total Shops",
      value: shops.length,
      icon: Store,
      bg: "bg-primary-container/10",
      fg: "text-primary-container",
    },
    {
      label: "Total Items",
      value: totalItems,
      icon: Package,
      bg: "bg-secondary-container/20",
      fg: "text-secondary",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: Globe,
      bg: "bg-tertiary-container/10",
      fg: "text-tertiary",
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: Eye,
      bg: "bg-surface-tint/10",
      fg: "text-surface-tint",
      formatted: formatCount(totalViews),
      delta: totalViews > 0 ? "+12%" : null,
    },
  ];

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-[32px] font-bold leading-tight tracking-tight text-on-surface">
            Welcome back, {firstName}
          </h1>
          <p className="text-on-surface-variant mt-1 text-base">
            Here&apos;s what&apos;s happening with your shops today.
          </p>
        </div>
        <Link
          href="/shops/new"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-[family-name:var(--font-inter)] text-sm font-medium hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" strokeWidth={2.4} />
          New Shop
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-stitch-1 flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                {s.label}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg}`}
              >
                <s.icon className={`w-[18px] h-[18px] ${s.fg}`} strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-on-surface">
                {s.formatted ?? s.value.toLocaleString()}
              </span>
              {s.delta && (
                <span className="font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wide text-secondary flex items-center">
                  <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.4} />
                  {s.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Shops list */}
      {shops.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center mb-4">
            <Store className="w-7 h-7 text-primary" />
          </div>
          <p className="text-on-surface-variant mb-4">
            You don&apos;t have any shops yet.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:bg-on-primary-fixed-variant transition-colors"
          >
            Set up your first shop
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">
              Your Shops
            </h2>
          </div>

          <div className="space-y-4">
            {shops.map((shop) => {
              const isPublished = shop.status === "PUBLISHED";
              const isSuspended = shop.status === "SUSPENDED";
              const planName = shop.subscription?.plan.name ?? "Free";
              const logoUrl = shop.branding?.logoUrl;

              return (
                <div
                  key={shop.id}
                  className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 overflow-hidden transition-all hover:shadow-stitch-2 ${
                    isSuspended ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Thumbnail */}
                      <div
                        className={`w-16 h-16 rounded-lg shrink-0 overflow-hidden relative border flex items-center justify-center ${
                          isSuspended
                            ? "bg-error-container/20 border-error/20 grayscale"
                            : "bg-surface-container-high border-outline-variant/20"
                        }`}
                      >
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={shop.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <Store
                            className="w-7 h-7 text-outline"
                            strokeWidth={1.6}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3
                            className={`text-lg font-semibold ${
                              isSuspended ? "text-on-surface-variant" : "text-on-surface"
                            }`}
                          >
                            {shop.name}
                          </h3>
                          <StatusBadge status={shop.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                          <span
                            className={`flex items-center gap-1 ${
                              isPublished ? "text-primary" : ""
                            } ${isSuspended ? "line-through opacity-60" : ""}`}
                          >
                            <Link2 className="w-4 h-4" strokeWidth={2} />
                            /s/{shop.slug}
                          </span>
                          <span className="text-outline-variant">•</span>
                          <span>{shop._count.items} items</span>
                          <span className="text-outline-variant">•</span>
                          <span className="flex items-center gap-1">
                            {planName.toLowerCase() !== "free" && (
                              <Star
                                className="w-4 h-4 text-tertiary"
                                strokeWidth={2}
                                fill="currentColor"
                              />
                            )}
                            {planName} Plan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto md:mt-0 pt-4 md:pt-0 border-t border-outline-variant/20 md:border-0">
                      {isPublished ? (
                        <Link
                          href={`/s/${shop.slug}`}
                          target="_blank"
                          className="flex-1 md:flex-none px-4 py-2 rounded border border-outline-variant text-on-surface font-[family-name:var(--font-inter)] text-sm font-medium hover:bg-surface-container transition-colors flex justify-center items-center gap-2"
                        >
                          <ExternalLink className="w-[18px] h-[18px]" strokeWidth={2} />
                          View
                        </Link>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="flex-1 md:flex-none px-4 py-2 rounded border border-outline-variant text-on-surface font-[family-name:var(--font-inter)] text-sm font-medium opacity-50 cursor-not-allowed flex justify-center items-center gap-2"
                        >
                          <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                          View
                        </span>
                      )}
                      <Link
                        href={`/shops/${shop.id}`}
                        className="flex-1 md:flex-none px-4 py-2 rounded bg-surface-container-high text-on-surface font-[family-name:var(--font-inter)] text-sm font-medium hover:bg-surface-variant transition-colors flex justify-center items-center gap-2"
                      >
                        {shop.status === "DRAFT" ? (
                          <Edit3 className="w-[18px] h-[18px]" strokeWidth={2} />
                        ) : (
                          <Settings className="w-[18px] h-[18px]" strokeWidth={2} />
                        )}
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

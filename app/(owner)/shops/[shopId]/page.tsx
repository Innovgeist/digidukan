import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Link2,
  ShoppingBag,
  FolderOpen,
  Layers,
  Settings,
  QrCode,
  BarChart3,
  Star,
} from "lucide-react";
import { ShopActions } from "./ShopActions";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function ShopOverviewPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      branding: true,
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

  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt) notFound();

  const plan = shop.subscription?.plan;
  const planName = plan?.name ?? "Free";
  const isPaidPlan = planName.toLowerCase() !== "free";

  const navCards = [
    {
      href: `/shops/${shopId}/items`,
      title: "Items",
      desc: "Manage your product/service catalog",
      Icon: ShoppingBag,
    },
    {
      href: `/shops/${shopId}/categories`,
      title: "Categories",
      desc: "Organise items into categories",
      Icon: FolderOpen,
    },
    {
      href: `/shops/${shopId}/collections`,
      title: "Collections",
      desc: "Seasonal & featured collections",
      Icon: Layers,
    },
    {
      href: `/shops/${shopId}/settings`,
      title: "Settings",
      desc: "Hours, banner, contact info",
      Icon: Settings,
    },
    {
      href: `/shops/${shopId}/qr`,
      title: "QR Code",
      desc: "Download QR for your storefront",
      Icon: QrCode,
    },
  ];

  const analyticsCard = {
    href: `/shops/${shopId}/analytics`,
    title: "Analytics",
    desc: plan?.analyticsEnabled ? "View your shop analytics" : "Upgrade for analytics",
    Icon: BarChart3,
    locked: !plan?.analyticsEnabled,
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface">
              {shop.name}
            </h1>
            <StatusBadge status={shop.status} />
            {isPaidPlan && (
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wide flex items-center gap-1">
                <Star className="w-3.5 h-3.5" strokeWidth={2.4} fill="currentColor" />
                {planName} plan
              </span>
            )}
          </div>
          <div className="flex items-center text-on-surface-variant text-sm gap-2 font-[family-name:var(--font-inter)]">
            <Link2 className="w-4 h-4" strokeWidth={2} />
            <a
              href={`/s/${shop.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary underline decoration-outline-variant underline-offset-2"
            >
              /s/{shop.slug}
            </a>
          </div>
        </div>

        <ShopActions shop={{ id: shop.id, status: shop.status, slug: shop.slug }} />
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link
          href={`/shops/${shopId}/items`}
          className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-stitch-1 flex flex-col items-center md:items-start hover:border-primary/40 transition-colors"
        >
          <span className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mb-1">
            Total Items
          </span>
          <span className="text-3xl md:text-[40px] font-bold leading-none text-on-surface">
            {shop._count.items}
          </span>
        </Link>
        <Link
          href={`/shops/${shopId}/categories`}
          className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-stitch-1 flex flex-col items-center md:items-start hover:border-primary/40 transition-colors"
        >
          <span className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mb-1">
            Categories
          </span>
          <span className="text-3xl md:text-[40px] font-bold leading-none text-on-surface">
            {shop._count.categories}
          </span>
        </Link>
        <Link
          href={`/shops/${shopId}/collections`}
          className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-stitch-1 flex flex-col items-center md:items-start hover:border-primary/40 transition-colors"
        >
          <span className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mb-1">
            Collections
          </span>
          <span className="text-3xl md:text-[40px] font-bold leading-none text-on-surface">
            {shop._count.collections}
          </span>
        </Link>
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {navCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-stitch-1 hover:shadow-stitch-2 hover:border-primary-fixed-dim transition-all duration-200 flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <card.Icon className="w-20 h-20" strokeWidth={1.5} />
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <card.Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-1">{card.title}</h3>
            <p className="text-sm text-on-surface-variant">{card.desc}</p>
          </Link>
        ))}

        {/* Analytics with conditional Pro badge */}
        <Link
          href={analyticsCard.href}
          className={`group bg-surface-container-lowest rounded-xl p-6 border shadow-stitch-1 hover:shadow-stitch-2 transition-all duration-200 flex flex-col h-full relative overflow-hidden ${
            analyticsCard.locked
              ? "border-outline-variant/30 hover:border-primary-fixed-dim"
              : "border-primary-fixed bg-gradient-to-br from-surface-container-lowest to-surface-container-low"
          }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <analyticsCard.Icon className="w-20 h-20" strokeWidth={1.5} />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                analyticsCard.locked
                  ? "bg-surface-container-high text-primary"
                  : "bg-primary text-on-primary shadow-sm"
              }`}
            >
              <analyticsCard.Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            {analyticsCard.locked && (
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-[family-name:var(--font-inter)] text-[12px] font-semibold flex items-center gap-1 border border-tertiary/20">
                <Star className="w-3 h-3" strokeWidth={2.4} fill="currentColor" />
                Pro
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-on-surface mb-1">{analyticsCard.title}</h3>
          <p className="text-sm text-on-surface-variant">{analyticsCard.desc}</p>
        </Link>
      </div>
    </div>
  );
}

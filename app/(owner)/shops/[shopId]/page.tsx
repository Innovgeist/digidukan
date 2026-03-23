import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  FolderOpen,
  Sparkles,
  Settings,
  QrCode,
  BarChart3,
} from "lucide-react";
import { ShopActions } from "./ShopActions";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function ShopOverviewPage({ params }: { params: Promise<{ shopId: string }> }) {
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

  const navCards = [
    { href: `/shops/${shopId}/items`, title: "Items", desc: "Manage your product/service catalog", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { href: `/shops/${shopId}/categories`, title: "Categories", desc: "Organise items into categories", icon: FolderOpen, color: "text-amber-600 bg-amber-50" },
    { href: `/shops/${shopId}/collections`, title: "Collections", desc: "Seasonal & featured collections", icon: Sparkles, color: "text-violet-600 bg-violet-50" },
    { href: `/shops/${shopId}/settings`, title: "Settings", desc: "Hours, banner, contact info", icon: Settings, color: "text-gray-600 bg-gray-100" },
    { href: `/shops/${shopId}/qr`, title: "QR Code", desc: "Download QR for your storefront", icon: QrCode, color: "text-green-600 bg-green-50" },
    { href: `/shops/${shopId}/analytics`, title: "Analytics", desc: plan?.analyticsEnabled ? "View your shop analytics" : "Upgrade for analytics", icon: BarChart3, color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-end gap-2 mb-3">
          <ShopActions shop={{ id: shop.id, status: shop.status, slug: shop.slug }} />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
          <StatusBadge status={shop.status} />
        </div>
        <p className="text-sm text-gray-500">/s/{shop.slug} · {plan?.name ?? "Free"} plan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Link href={`/shops/${shopId}/items`} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors">
          <p className="text-2xl font-bold text-gray-900">{shop._count.items}</p>
          <p className="text-sm text-gray-500">Items</p>
        </Link>
        <Link href={`/shops/${shopId}/categories`} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors">
          <p className="text-2xl font-bold text-gray-900">{shop._count.categories}</p>
          <p className="text-sm text-gray-500">Categories</p>
        </Link>
        <Link href={`/shops/${shopId}/collections`} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors">
          <p className="text-2xl font-bold text-gray-900">{shop._count.collections}</p>
          <p className="text-sm text-gray-500">Collections</p>
        </Link>
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {navCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors flex items-center gap-4"
          >
            <div className={`p-2.5 rounded-lg shrink-0 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm">{card.title}</p>
              <p className="text-xs text-gray-500 truncate">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

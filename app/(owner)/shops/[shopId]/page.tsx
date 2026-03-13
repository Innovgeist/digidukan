import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ShopActions } from "./ShopActions";

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

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            <StatusBadge status={shop.status} />
          </div>
          <p className="text-sm text-gray-500">/s/{shop.slug} · {plan?.name ?? "Free"} plan</p>
        </div>
        <ShopActions shop={{ id: shop.id, status: shop.status, slug: shop.slug }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Items" value={shop._count.items} href={`/shops/${shopId}/items`} />
        <StatCard label="Categories" value={shop._count.categories} href={`/shops/${shopId}/categories`} />
        <StatCard label="Collections" value={shop._count.collections} href={`/shops/${shopId}/collections`} />
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-2 gap-4">
        <NavCard href={`/shops/${shopId}/items`} title="Items" desc="Manage your product/service catalog" icon="🛍️" />
        <NavCard href={`/shops/${shopId}/categories`} title="Categories" desc="Organise items into categories" icon="📂" />
        <NavCard href={`/shops/${shopId}/collections`} title="Collections" desc="Seasonal & featured collections" icon="✨" />
        <NavCard href={`/shops/${shopId}/settings`} title="Settings" desc="Hours, banner, contact info" icon="⚙️" />
        <NavCard href={`/shops/${shopId}/qr`} title="QR Code" desc="Download QR for your storefront" icon="📱" />
        <NavCard
          href={`/shops/${shopId}/analytics`}
          title="Analytics"
          desc={plan?.analyticsEnabled ? "View your shop analytics" : "Upgrade for analytics"}
          icon="📊"
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-gray-100 text-gray-600",
    SUSPENDED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? ""}`}>
      {status.toLowerCase()}
    </span>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </Link>
  );
}

function NavCard({ href, title, desc, icon }: { href: string; title: string; desc: string; icon: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

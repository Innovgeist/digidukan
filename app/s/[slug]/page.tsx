import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontBanner } from "@/components/storefront/StorefrontBanner";
import { StorefrontActions } from "@/components/storefront/StorefrontActions";
import { StorefrontClient } from "@/components/storefront/StorefrontClient";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { StorefrontAnalytics } from "@/components/storefront/StorefrontAnalytics";

export const revalidate = 60; // ISR

export default async function StorefrontPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: {
      branding: true,
      banner: true,
      subscription: { include: { plan: true } },
      // Fetch ALL items directly — not nested inside categories —
      // so uncategorized items are never silently dropped.
      items: {
        where: { deletedAt: null },
        orderBy: { displayOrder: "asc" },
        include: { category: { select: { id: true, name: true } } },
      },
      // Categories are only needed for the tab-filter UI.
      categories: {
        where: { deletedAt: null, isActive: true },
        orderBy: { displayOrder: "asc" },
      },
      collections: {
        where: { deletedAt: null, isActive: true },
        orderBy: { displayOrder: "asc" },
        include: {
          itemCollections: { include: { item: true } },
        },
      },
    },
  });

  if (!shop || shop.deletedAt) notFound();
  if (shop.status === "SUSPENDED") return <SuspendedPage name={shop.name} />;
  if (shop.status !== "PUBLISHED") notFound();

  const isQrScan = ref === "qr";
  const showWatermark = shop.subscription?.plan.watermarkEnabled ?? true;
  const bannerActive =
    shop.banner?.isActive &&
    (!shop.banner.expiresAt || new Date(shop.banner.expiresAt) > new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <StorefrontAnalytics slug={slug} isQrScan={isQrScan} />
      <StorefrontHeader
        name={shop.name}
        description={shop.description}
        logoUrl={shop.branding?.logoUrl}
        coverUrl={shop.branding?.coverUrl}
        primaryColor={shop.branding?.primaryColor ?? "#3B82F6"}
        isOpen={shop.isOpen}
      />
      {bannerActive && <StorefrontBanner text={shop.banner!.text} />}
      <StorefrontActions
        phone={shop.phone}
        whatsappNumber={shop.whatsappNumber}
        mapsUrl={shop.mapsUrl}
        shopSlug={slug}
      />
      <StorefrontClient
        items={shop.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          oldPrice: item.oldPrice ? Number(item.oldPrice) : null,
          description: item.description,
          imageUrl: item.imageUrl,
          isAvailable: item.isAvailable,
          isFeatured: item.isFeatured,
          isBestseller: item.isBestseller,
          dietaryType: item.dietaryType,
          categoryId: item.categoryId,
          categoryName: item.category?.name ?? "",
        }))}
        categories={shop.categories.map((c) => ({ id: c.id, name: c.name }))}
        collections={shop.collections.map((col) => ({
          id: col.id,
          name: col.name,
          coverUrl: col.coverUrl,
          type: col.type,
          itemIds: col.itemCollections.map((ic) => ic.itemId),
        }))}
        primaryColor={shop.branding?.primaryColor ?? "#3B82F6"}
        shopId={shop.id}
        shopName={shop.name}
        whatsappNumber={shop.whatsappNumber ?? ""}
      />
      <StorefrontFooter showWatermark={showWatermark} />
    </div>
  );
}

function SuspendedPage({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
        <p className="text-gray-500">
          This shop has been temporarily suspended.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Please contact the shop owner for more information.
        </p>
      </div>
    </div>
  );
}

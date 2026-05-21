import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontBanner } from "@/components/storefront/StorefrontBanner";
import { StorefrontActions } from "@/components/storefront/StorefrontActions";
import { StorefrontClient } from "@/components/storefront/StorefrontClient";
import { StorefrontFooter } from "@/components/storefront/StorefrontFooter";
import { StorefrontAnalytics } from "@/components/storefront/StorefrontAnalytics";
import { HeaderPremium } from "@/components/storefront/premium/HeaderPremium";
import { BannerPremium } from "@/components/storefront/premium/BannerPremium";
import { ActionsPremium } from "@/components/storefront/premium/ActionsPremium";
import { StorefrontClientPremium } from "@/components/storefront/premium/StorefrontClientPremium";
import { FooterPremium } from "@/components/storefront/premium/FooterPremium";
import { AlertTriangle } from "lucide-react";

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
  const primaryColor = shop.branding?.primaryColor ?? "#D9622E";
  const isPremium = shop.isPremium;
  const bannerActive =
    shop.banner?.isActive &&
    (!shop.banner.expiresAt || new Date(shop.banner.expiresAt) > new Date());

  const items = shop.items.map((item) => ({
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
  }));
  const categories = shop.categories.map((c) => ({ id: c.id, name: c.name }));
  const collections = shop.collections.map((col) => ({
    id: col.id,
    name: col.name,
    coverUrl: col.coverUrl,
    type: col.type,
    itemIds: col.itemCollections.map((ic) => ic.itemId),
  }));

  if (isPremium) {
    return (
      <div className="min-h-screen bg-[var(--color-heritage-cream)] relative">
        <div className="fixed inset-0 pointer-events-none bg-damask z-0" aria-hidden />
        <div className="relative z-10">
          <StorefrontAnalytics slug={slug} isQrScan={isQrScan} />
          <HeaderPremium
            name={shop.name}
            description={shop.description}
            logoUrl={shop.branding?.logoUrl}
            coverUrl={shop.branding?.coverUrl}
            primaryColor={primaryColor}
            isOpen={shop.isOpen}
          />
          {bannerActive && <BannerPremium text={shop.banner!.text} />}
          <ActionsPremium
            phone={shop.phone}
            whatsappNumber={shop.whatsappNumber}
            mapsUrl={shop.mapsUrl}
            shopSlug={slug}
          />
          <StorefrontClientPremium
            items={items}
            categories={categories}
            collections={collections}
            primaryColor={primaryColor}
            shopId={shop.id}
            shopName={shop.name}
            whatsappNumber={shop.whatsappNumber ?? ""}
          />
          <FooterPremium showWatermark={showWatermark} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <StorefrontAnalytics slug={slug} isQrScan={isQrScan} />
      <StorefrontHeader
        name={shop.name}
        description={shop.description}
        logoUrl={shop.branding?.logoUrl}
        coverUrl={shop.branding?.coverUrl}
        primaryColor={primaryColor}
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
        items={items}
        categories={categories}
        collections={collections}
        primaryColor={primaryColor}
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
    <div className="min-h-screen bg-paper flex items-center justify-center p-8 text-center">
      <div className="max-w-sm reveal-up">
        <div className="w-16 h-16 bg-brick-soft border-2 border-brick/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-brick" strokeWidth={1.8} />
        </div>
        <h1 className="font-display font-semibold text-2xl text-ink tracking-tight mb-2">
          {name}
        </h1>
        <p className="text-[14px] text-ink-2 leading-relaxed">
          This shop has been temporarily suspended.
        </p>
        <p className="text-[12px] text-ink-3 mt-2">
          Please contact the shop owner for more information.
        </p>
      </div>
    </div>
  );
}

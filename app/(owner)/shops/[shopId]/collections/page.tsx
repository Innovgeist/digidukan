import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { canAddCollection } from "@/lib/plan";
import { CollectionManager } from "./CollectionManager";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id) notFound();

  const collections = await prisma.collection.findMany({
    where: { shopId, deletedAt: null },
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { itemCollections: true } } },
  });

  const check = await canAddCollection(shopId);
  const limitDisplay = check.limit === -1 ? "∞" : String(check.limit);

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <Link
        href={`/shops/${shopId}`}
        className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to {shop.name}
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface mb-1">
          Collections
        </h1>
        <p className="text-base text-on-surface-variant">
          Group items into seasonal or featured sets to highlight on your storefront.{" "}
          <span className="font-[family-name:var(--font-inter)] font-medium">
            {check.current}/{limitDisplay} used
          </span>
        </p>
      </div>

      {!check.allowed && (
        <div className="bg-tertiary-fixed/40 border border-tertiary/20 rounded-xl p-4 mb-6">
          <p className="text-on-tertiary-fixed text-sm font-semibold">
            Collection limit reached ({check.current}/{check.limit})
          </p>
          <p className="text-on-tertiary-fixed-variant text-xs mt-0.5">
            Upgrade your plan to add more collections.
          </p>
        </div>
      )}

      <CollectionManager
        shopId={shopId}
        collections={collections.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          description: c.description ?? "",
          coverUrl: c.coverUrl ?? "",
          coverPublicId: c.coverPublicId ?? "",
          displayOrder: c.displayOrder,
          isActive: c.isActive,
          startsAt: c.startsAt ? c.startsAt.toISOString() : "",
          endsAt: c.endsAt ? c.endsAt.toISOString() : "",
          itemCount: c._count.itemCollections,
        }))}
        limitReached={!check.allowed}
        limit={check.limit}
      />
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { canAddCollection } from "@/lib/plan";
import { CollectionManager } from "./CollectionManager";

export default async function CollectionsPage({ params }: { params: Promise<{ shopId: string }> }) {
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

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <a href={`/shops/${shopId}`} className="text-sm text-gray-500 hover:text-gray-700">
          &larr; {shop.name}
        </a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <div className="text-sm text-gray-500">
          {check.current}/{check.limit === -1 ? "\u221e" : check.limit} used
        </div>
      </div>

      {!check.allowed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-amber-800 text-sm font-medium">
            Collection limit reached ({check.current}/{check.limit})
          </p>
          <p className="text-amber-700 text-xs mt-0.5">
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

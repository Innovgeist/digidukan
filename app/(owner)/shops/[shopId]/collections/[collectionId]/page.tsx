import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { CollectionItemManager } from "./CollectionItemManager";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ shopId: string; collectionId: string }>;
}) {
  const { shopId, collectionId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      itemCollections: {
        include: {
          item: {
            include: { category: true },
          },
        },
      },
      shop: true,
    },
  });

  if (!collection || collection.deletedAt || collection.shop.ownerId !== session.user.id) {
    notFound();
  }

  // Items not yet in this collection
  const availableItems = await prisma.item.findMany({
    where: {
      shopId,
      deletedAt: null,
      itemCollections: { none: { collectionId } },
    },
    include: { category: true },
    orderBy: { displayOrder: "asc" },
  });

  const collectionItems = collection.itemCollections.map((ic) => ({
    id: ic.item.id,
    name: ic.item.name,
    price: Number(ic.item.price),
    imageUrl: ic.item.imageUrl ?? "",
    categoryName: ic.item.category?.name ?? null,
  }));

  const available = availableItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    imageUrl: item.imageUrl ?? "",
    categoryName: item.category?.name ?? null,
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-1">
        <a
          href={`/shops/${shopId}/collections`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Collections
        </a>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{collection.name}</h1>
        {collection.description && (
          <p className="text-sm text-gray-500 mt-1">{collection.description}</p>
        )}
      </div>

      <CollectionItemManager
        shopId={shopId}
        collectionId={collectionId}
        collectionName={collection.name}
        collectionItems={collectionItems}
        availableItems={available}
      />
    </div>
  );
}

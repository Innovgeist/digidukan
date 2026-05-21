import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
          item: { include: { category: true } },
        },
      },
      shop: true,
    },
  });

  if (
    !collection ||
    collection.deletedAt ||
    collection.shop.ownerId !== session.user.id
  ) {
    notFound();
  }

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
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <Link
        href={`/shops/${shopId}/collections`}
        className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Collections
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface mb-1">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-base text-on-surface-variant">
            {collection.description}
          </p>
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

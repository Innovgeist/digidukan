import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { ItemList } from "./ItemList";
import { canAddItem } from "@/lib/plan";

export default async function ItemsPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id) notFound();

  const categories = await prisma.category.findMany({
    where: { shopId, deletedAt: null, isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const items = await prisma.item.findMany({
    where: { shopId, deletedAt: null },
    include: { category: true },
    orderBy: { displayOrder: "asc" },
  });

  const limitCheck = await canAddItem(shopId);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-3">
        <a href={`/shops/${shopId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium">
          <ArrowLeft className="w-4 h-4" />
          {shop.name}
        </a>
        {limitCheck.allowed ? (
          <Link
            href={`/shops/${shopId}/items/new`}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Link>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-right">
            <p className="text-amber-800 text-xs font-medium">Item limit reached ({limitCheck.current}/{limitCheck.limit})</p>
            <a href="mailto:sales@innovgeist.com" className="text-xs text-blue-600 hover:underline">Upgrade plan</a>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Items</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {limitCheck.current}/{limitCheck.limit === -1 ? "∞" : limitCheck.limit} items used
        </p>
      </div>

      <ItemList
        shopId={shopId}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          price: Number(i.price),
          oldPrice: i.oldPrice ? Number(i.oldPrice) : null,
          imageUrl: i.imageUrl ?? "",
          isAvailable: i.isAvailable,
          isFeatured: i.isFeatured,
          isBestseller: i.isBestseller,
          categoryName: i.category?.name ?? null,
          itemType: i.itemType,
          dietaryType: i.dietaryType,
        }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}

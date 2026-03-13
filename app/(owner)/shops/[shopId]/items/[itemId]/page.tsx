import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ItemForm } from "@/components/owner/ItemForm";

export default async function EditItemPage({ params }: { params: Promise<{ shopId: string; itemId: string }> }) {
  const { shopId, itemId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { shop: true },
  });

  if (!item || item.shop.ownerId !== session.user.id || item.deletedAt) notFound();

  const categories = await prisma.category.findMany({
    where: { shopId, deletedAt: null, isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="p-6 max-w-2xl">
      <a href={`/shops/${shopId}/items`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← Back to Items
      </a>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Item</h1>
      <ItemForm
        shopId={shopId}
        itemId={itemId}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        businessType={item.shop.businessType}
        defaultValues={{
          name: item.name,
          itemType: item.itemType,
          price: String(item.price),
          oldPrice: item.oldPrice ? String(item.oldPrice) : "",
          categoryId: item.categoryId ?? "",
          description: item.description ?? "",
          imageUrl: item.imageUrl ?? "",
          imagePublicId: item.imagePublicId ?? "",
          isAvailable: item.isAvailable,
          isFeatured: item.isFeatured,
          isBestseller: item.isBestseller,
          displayOrder: item.displayOrder,
          dietaryType: item.dietaryType,
        }}
      />
    </div>
  );
}

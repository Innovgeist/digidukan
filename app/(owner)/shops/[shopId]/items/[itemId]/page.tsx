import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ItemForm } from "@/components/owner/ItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ shopId: string; itemId: string }>;
}) {
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
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <Link
        href={`/shops/${shopId}/items`}
        className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Items
      </Link>
      <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface mb-6">
        Edit Item
      </h1>
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

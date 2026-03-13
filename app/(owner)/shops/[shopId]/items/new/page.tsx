import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ItemForm } from "@/components/owner/ItemForm";
import { canAddItem } from "@/lib/plan";

export default async function NewItemPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id) notFound();

  const limitCheck = await canAddItem(shopId);
  if (!limitCheck.allowed) redirect(`/shops/${shopId}/items`);

  const categories = await prisma.category.findMany({
    where: { shopId, deletedAt: null, isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="p-6 max-w-2xl">
      <a href={`/shops/${shopId}/items`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← Back to Items
      </a>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Item</h1>
      <ItemForm
        shopId={shopId}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        businessType={shop.businessType}
      />
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { CategoryManager } from "./CategoryManager";
import { canAddCategory } from "@/lib/plan";

export default async function CategoriesPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id) notFound();

  const categories = await prisma.category.findMany({
    where: { shopId, deletedAt: null },
    include: { _count: { select: { items: { where: { deletedAt: null } } } } },
    orderBy: { displayOrder: "asc" },
  });

  const limitCheck = await canAddCategory(shopId);
  const plan = await prisma.shopSubscription.findUnique({
    where: { shopId },
    include: { plan: true },
  });

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <a href={`/shops/${shopId}`} className="text-sm text-gray-500 hover:text-gray-700">← {shop.name}</a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="text-sm text-gray-500">
          {limitCheck.current}/{limitCheck.limit === -1 ? "∞" : limitCheck.limit} used
        </div>
      </div>

      {!limitCheck.allowed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-amber-800 text-sm font-medium">Category limit reached ({limitCheck.current}/{limitCheck.limit})</p>
          <p className="text-amber-700 text-xs mt-0.5">Upgrade your plan to add more categories.</p>
        </div>
      )}

      <CategoryManager
        shopId={shopId}
        categories={categories.map((c) => ({ id: c.id, name: c.name, description: c.description ?? "", isActive: c.isActive, displayOrder: c.displayOrder, itemCount: c._count.items }))}
        canAdd={limitCheck.allowed}
        limit={limitCheck.limit}
        current={limitCheck.current}
      />
    </div>
  );
}

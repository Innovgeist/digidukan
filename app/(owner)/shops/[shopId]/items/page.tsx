import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { ItemList } from "./ItemList";
import { canAddItem } from "@/lib/plan";

export default async function ItemsPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
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
  const limitDisplay =
    limitCheck.limit === -1 ? "∞" : String(limitCheck.limit);

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <Link
        href={`/shops/${shopId}`}
        className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        {shop.name}
      </Link>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface mb-1">
            Items
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                limitCheck.allowed ? "bg-secondary" : "bg-error"
              }`}
            />
            {limitCheck.current}/{limitDisplay} items used
          </p>
        </div>
        {limitCheck.allowed ? (
          <Link
            href={`/shops/${shopId}/items/new`}
            className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium px-6 py-3 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" strokeWidth={2.4} />
            Add Item
          </Link>
        ) : (
          <div className="bg-error-container border border-error/20 rounded-lg px-4 py-2 text-right">
            <p className="text-on-error-container text-xs font-medium">
              Item limit reached ({limitCheck.current}/{limitCheck.limit})
            </p>
            <a
              href="mailto:sales@innovgeist.com"
              className="text-xs text-primary hover:underline font-medium"
            >
              Upgrade plan
            </a>
          </div>
        )}
      </header>

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

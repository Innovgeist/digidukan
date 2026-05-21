import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryManager } from "./CategoryManager";
import { canAddCategory } from "@/lib/plan";

export default async function CategoriesPage({
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
    where: { shopId, deletedAt: null },
    include: { _count: { select: { items: { where: { deletedAt: null } } } } },
    orderBy: { displayOrder: "asc" },
  });

  const limitCheck = await canAddCategory(shopId);
  const limitDisplay = limitCheck.limit === -1 ? "∞" : String(limitCheck.limit);

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
          Categories
        </h1>
        <p className="text-base text-on-surface-variant">
          Organize your products into collections to help customers find what they need.{" "}
          <span className="font-[family-name:var(--font-inter)] font-medium">
            {limitCheck.current}/{limitDisplay} used
          </span>
        </p>
      </div>

      {!limitCheck.allowed && (
        <div className="bg-tertiary-fixed/40 border border-tertiary/20 rounded-xl p-4 mb-6">
          <p className="text-on-tertiary-fixed text-sm font-semibold">
            Category limit reached ({limitCheck.current}/{limitCheck.limit})
          </p>
          <p className="text-on-tertiary-fixed-variant text-xs mt-0.5">
            Upgrade your plan to add more categories.
          </p>
        </div>
      )}

      <CategoryManager
        shopId={shopId}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description ?? "",
          isActive: c.isActive,
          displayOrder: c.displayOrder,
          itemCount: c._count.items,
        }))}
        canAdd={limitCheck.allowed}
        limit={limitCheck.limit}
        current={limitCheck.current}
      />
    </div>
  );
}

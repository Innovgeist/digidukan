import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Crown } from "lucide-react";
import { ItemForm } from "@/components/owner/ItemForm";
import { canAddItem } from "@/lib/plan";

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id) notFound();

  const limitCheck = await canAddItem(shopId);

  if (!limitCheck.allowed) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
        <Link
          href={`/shops/${shopId}/items`}
          className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Items
        </Link>
        <div className="max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-tertiary-fixed/40 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-tertiary" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-semibold text-on-surface mb-2">
            Item Limit Reached
          </h1>
          <p className="text-sm text-on-surface-variant mb-1">
            You&apos;ve used {limitCheck.current} of {limitCheck.limit} items on your current plan.
          </p>
          <p className="text-sm text-on-surface-variant mb-6">
            Upgrade to add up to 500 items with unlimited categories and collections.
          </p>
          <a
            href="mailto:sales@innovgeist.com"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-on-primary-fixed-variant transition-colors"
          >
            <Crown className="w-4 h-4" />
            Contact Sales
          </a>
          <p className="text-xs text-outline mt-3">
            <a
              href="mailto:sales@innovgeist.com"
              className="text-primary hover:underline"
            >
              sales@innovgeist.com
            </a>
            {" · "}
            <a href="tel:+919305602733" className="text-primary hover:underline">
              +91-9305602733
            </a>
          </p>
        </div>
      </div>
    );
  }

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
        Add New Item
      </h1>
      <ItemForm
        shopId={shopId}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        businessType={shop.businessType}
      />
    </div>
  );
}

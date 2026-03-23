import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Crown } from "lucide-react";
import { ItemForm } from "@/components/owner/ItemForm";
import { canAddItem } from "@/lib/plan";

export default async function NewItemPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id) notFound();

  const limitCheck = await canAddItem(shopId);

  if (!limitCheck.allowed) {
    return (
      <div className="p-6 lg:p-8 max-w-lg">
        <Link href={`/shops/${shopId}/items`} className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Items
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Item Limit Reached</h1>
          <p className="text-sm text-gray-500 mb-1">
            You&apos;ve used {limitCheck.current} of {limitCheck.limit} items on your current plan.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Upgrade to add up to 500 items with unlimited categories and collections.
          </p>
          <a
            href="mailto:sales@innovgeist.com"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            <Crown className="w-4 h-4" />
            Contact Sales
          </a>
          <p className="text-xs text-gray-400 mt-3">
            <a href="mailto:sales@innovgeist.com" className="text-blue-600 hover:underline">sales@innovgeist.com</a>
            {" · "}
            <a href="tel:+919305602733" className="text-blue-600 hover:underline">+91-9305602733</a>
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
    <div className="p-6 lg:p-8 max-w-2xl">
      <a href={`/shops/${shopId}/items`} className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium mb-3">
        <ArrowLeft className="w-4 h-4" />
        Back to Items
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

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ShopSettingsForm } from "./ShopSettingsForm";
import { ShopEditForm } from "./ShopEditForm";

export default async function ShopSettingsPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: { branding: true, banner: true },
  });

  if (!shop || shop.ownerId !== session.user.id) notFound();

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <a href={`/shops/${shopId}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← {shop.name}</a>
        <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Details</h2>
        <ShopEditForm
          shopId={shopId}
          defaultValues={{
            name: shop.name, slug: shop.slug, phone: shop.phone,
            whatsappNumber: shop.whatsappNumber, description: shop.description ?? "",
            email: shop.email ?? "", address: shop.address ?? "",
            city: shop.city ?? "", state: shop.state ?? "",
            country: shop.country, postalCode: shop.postalCode ?? "",
            mapsUrl: shop.mapsUrl ?? "", businessType: shop.businessType,
          }}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Open / Closed & Banner</h2>
        <ShopSettingsForm
          shopId={shopId}
          isOpen={shop.isOpen}
          banner={shop.banner ? { text: shop.banner.text, isActive: shop.banner.isActive, expiresAt: shop.banner.expiresAt?.toISOString().split("T")[0] ?? "" } : null}
        />
      </section>
    </div>
  );
}

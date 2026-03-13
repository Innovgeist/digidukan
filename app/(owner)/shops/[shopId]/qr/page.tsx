import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { getOrGenerateQR } from "@/lib/qr";
import { QRPageClient } from "./QRPageClient";

export default async function QRPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: { id: true, name: true, slug: true, ownerId: true, deletedAt: true, status: true },
  });

  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt) notFound();

  const qrUrl = await getOrGenerateQR(shopId, shop.slug);
  const targetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/s/${shop.slug}`;

  return (
    <div className="p-6 max-w-lg">
      <a href={`/shops/${shopId}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← {shop.name}
      </a>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">QR Code</h1>
      <QRPageClient
        shopId={shopId}
        shopName={shop.name}
        shopSlug={shop.slug}
        qrUrl={qrUrl}
        targetUrl={targetUrl}
        isPublished={shop.status === "PUBLISHED"}
      />
    </div>
  );
}

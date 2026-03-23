import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { OwnerAdminActions } from "./OwnerAdminActions";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function OwnerDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const owner = await prisma.user.findUnique({
    where: { id: userId, role: "OWNER" },
    include: {
      shops: {
        where: { deletedAt: null },
        include: {
          subscription: { include: { plan: true } },
          _count: { select: { items: { where: { deletedAt: null } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!owner) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <Link href="/admin/owners" className="text-sm text-gray-500 hover:text-gray-700 inline-block">
        ← All Owners
      </Link>

      {/* Owner info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{owner.name ?? "(no name)"}</h1>
        <p className="text-sm text-gray-500">{owner.email}</p>
        <p className="text-xs text-gray-400 mt-1">
          Joined {new Date(owner.createdAt).toLocaleDateString("en-IN")} · {owner.shops.length} shop(s)
        </p>
      </div>

      {/* Shops */}
      {owner.shops.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Shops</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {owner.shops.map((shop) => (
              <div key={shop.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{shop.name}</p>
                  <p className="text-xs text-gray-400">
                    /s/{shop.slug} · {shop._count.items} items · {shop.subscription?.plan.name ?? "Free"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={shop.status} />
                  <Link href={`/admin/shops/${shop.id}`} className="text-xs text-blue-600 hover:underline">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin actions */}
      <OwnerAdminActions ownerId={userId} ownerName={owner.name ?? owner.email} />
    </div>
  );
}


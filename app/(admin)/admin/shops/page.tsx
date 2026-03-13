import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminShopsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const shops = await prisma.shop.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      subscription: { include: { plan: true } },
      _count: { select: { items: { where: { deletedAt: null } }, categories: { where: { deletedAt: null } } } },
    },
  });

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Shops ({shops.length})</h1>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {shops.map((shop) => (
          <div key={shop.id} className="flex items-center justify-between px-5 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-gray-900 text-sm">{shop.name}</p>
                <StatusBadge status={shop.status} />
              </div>
              <p className="text-xs text-gray-400">
                /s/{shop.slug} · {shop._count.items} items · {shop._count.categories} categories · {shop.subscription?.plan.name ?? "Free"}
              </p>
            </div>
            <Link
              href={`/admin/shops/${shop.id}`}
              className="text-sm text-blue-600 hover:underline ml-4 flex-shrink-0"
            >
              Manage
            </Link>
          </div>
        ))}
        {shops.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No shops found.</div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-gray-100 text-gray-600",
    SUSPENDED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? ""}`}>
      {status.toLowerCase()}
    </span>
  );
}

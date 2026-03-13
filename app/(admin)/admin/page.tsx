import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const [ownerCount, shopCount, publishedCount, totalEvents] = await Promise.all([
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.shop.count({ where: { deletedAt: null } }),
    prisma.shop.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.analyticsEvent.count(),
  ]);

  const recentShops = await prisma.shop.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, slug: true, status: true, createdAt: true },
  });

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Owners" value={ownerCount} />
        <StatCard label="Total Shops" value={shopCount} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="Analytics Events" value={totalEvents} />
      </div>

      {/* Recent shops */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Shops</h2>
          <Link href="/admin/shops" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentShops.map((shop) => (
            <div key={shop.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{shop.name}</p>
                <p className="text-xs text-gray-400">/s/{shop.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={shop.status} />
                <Link href={`/admin/shops/${shop.id}`} className="text-xs text-blue-600 hover:underline">Manage</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500">{label}</p>
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
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status.toLowerCase()}
    </span>
  );
}

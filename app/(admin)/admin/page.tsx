import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Store, Globe, BarChart3 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EventsBarChart, ShopStatusPieChart } from "@/components/admin/AdminCharts";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const [ownerCount, shopCount, publishedCount, totalEvents] =
    await Promise.all([
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.shop.count({ where: { deletedAt: null } }),
      prisma.shop.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.analyticsEvent.count(),
    ]);

  // Shop status distribution for pie chart
  const statusCounts = await prisma.shop.groupBy({
    by: ["status"],
    where: { deletedAt: null },
    _count: { _all: true },
  });
  const pieData = statusCounts.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

  // Analytics events per day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentEvents = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  });

  const eventsByDay: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    eventsByDay[key] = 0;
  }
  for (const e of recentEvents) {
    const key = e.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    if (key in eventsByDay) eventsByDay[key]++;
  }
  const barData = Object.entries(eventsByDay).map(([date, count]) => ({ date, count }));

  // Recent shops
  const recentShops = await prisma.shop.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      owner: { select: { name: true } },
    },
  });

  // Recent admin logs
  const recentLogs = await prisma.adminActionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { admin: { select: { email: true } } },
  });

  const stats = [
    { label: "Total Owners", value: ownerCount, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Total Shops", value: shopCount, icon: Store, color: "text-violet-600 bg-violet-50" },
    { label: "Published", value: publishedCount, icon: Globe, color: "text-green-600 bg-green-50" },
    { label: "Analytics Events", value: totalEvents, icon: BarChart3, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {s.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Events — Last 7 Days
          </h2>
          {barData.some((d) => d.count > 0) ? (
            <EventsBarChart data={barData} />
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              No analytics events yet
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Shop Status Distribution
          </h2>
          {pieData.length > 0 ? (
            <ShopStatusPieChart data={pieData} />
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              No shops yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: recent shops + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent shops */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Shops</h2>
            <Link
              href="/admin/shops"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentShops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {shop.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    by {shop.owner.name ?? "—"} · /s/{shop.slug}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={shop.status} />
                  <Link
                    href={`/admin/shops/${shop.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
            {recentShops.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-gray-400">
                No shops yet
              </p>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link
              href="/admin/logs"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLogs.map((log) => (
              <div key={log.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-semibold">
                    {log.action}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {log.targetType} · by {log.admin.email}
                </p>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-gray-400">
                No admin actions yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

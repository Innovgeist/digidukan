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

  const [ownerCount, shopCount, publishedCount, totalEvents] = await Promise.all([
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.shop.count({ where: { deletedAt: null } }),
    prisma.shop.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.analyticsEvent.count(),
  ]);

  const statusCounts = await prisma.shop.groupBy({
    by: ["status"],
    where: { deletedAt: null },
    _count: { _all: true },
  });
  const pieData = statusCounts.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

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
    const key = e.createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    if (key in eventsByDay) eventsByDay[key]++;
  }
  const barData = Object.entries(eventsByDay).map(([date, count]) => ({
    date,
    count,
  }));

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

  const recentLogs = await prisma.adminActionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { admin: { select: { email: true } } },
  });

  const stats = [
    {
      label: "Total Owners",
      value: ownerCount,
      icon: Users,
      bg: "bg-primary-container/10",
      fg: "text-primary-container",
    },
    {
      label: "Total Shops",
      value: shopCount,
      icon: Store,
      bg: "bg-secondary-container/20",
      fg: "text-secondary",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: Globe,
      bg: "bg-tertiary-container/10",
      fg: "text-tertiary",
    },
    {
      label: "Analytics Events",
      value: totalEvents,
      icon: BarChart3,
      bg: "bg-surface-tint/10",
      fg: "text-surface-tint",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 font-[family-name:var(--font-jakarta)] text-on-surface">
      <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface">
        Admin Overview
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-stitch-1 flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                {s.label}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg}`}
              >
                <s.icon className={`w-[18px] h-[18px] ${s.fg}`} strokeWidth={2} />
              </div>
            </div>
            <span className="text-2xl font-semibold text-on-surface">
              {s.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-5">
          <h2 className="text-xl font-semibold text-on-surface mb-4">
            Events — Last 7 Days
          </h2>
          {barData.some((d) => d.count > 0) ? (
            <EventsBarChart data={barData} />
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-on-surface-variant">
              No analytics events yet
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-5">
          <h2 className="text-xl font-semibold text-on-surface mb-4">
            Shop Status Distribution
          </h2>
          {pieData.length > 0 ? (
            <ShopStatusPieChart data={pieData} />
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-on-surface-variant">
              No shops yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
            <h2 className="text-xl font-semibold text-on-surface">Recent Shops</h2>
            <Link
              href="/admin/shops"
              className="text-sm text-primary hover:underline font-medium font-[family-name:var(--font-inter)]"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {recentShops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface">
                    {shop.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    by {shop.owner.name ?? "—"} · /s/{shop.slug}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={shop.status} />
                  <Link
                    href={`/admin/shops/${shop.id}`}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
            {recentShops.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-on-surface-variant">
                No shops yet
              </p>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
            <h2 className="text-xl font-semibold text-on-surface">
              Recent Activity
            </h2>
            <Link
              href="/admin/logs"
              className="text-sm text-primary hover:underline font-medium font-[family-name:var(--font-inter)]"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {recentLogs.map((log) => (
              <div key={log.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-mono text-xs font-semibold">
                    {log.action}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {new Date(log.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  {log.targetType} · by {log.admin.email}
                </p>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-on-surface-variant">
                No admin actions yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

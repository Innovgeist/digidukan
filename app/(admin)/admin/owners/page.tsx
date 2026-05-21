import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Search, ArrowRight } from "lucide-react";

export default async function AdminOwnersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const { q } = await searchParams;

  const owners = await prisma.user.findMany({
    where: {
      role: "OWNER",
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { shops: { where: { deletedAt: null } } } },
    },
  });

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface">
            Owners
          </h1>
          <p className="text-base text-on-surface-variant mt-1">
            {owners.length} {owners.length === 1 ? "owner" : "owners"} found
          </p>
        </div>
        <Link
          href="/admin/owners/new"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-[family-name:var(--font-inter)] text-sm font-medium hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" strokeWidth={2.4} />
          Create Owner
        </Link>
      </header>

      {/* Search */}
      <form className="mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline"
            strokeWidth={2}
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email..."
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-bright text-on-surface text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </form>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 overflow-hidden">
        {/* Header (desktop) */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-outline-variant/30 bg-surface-container-low font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          <div>Owner</div>
          <div className="w-24 text-right">Shops</div>
          <div className="w-32 text-right">Joined</div>
          <div className="w-20 text-right">Action</div>
        </div>

        <div className="divide-y divide-outline-variant/30">
          {owners.map((owner, idx) => (
            <div
              key={owner.id}
              className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-surface-container-low transition-colors ${
                idx % 2 === 1 ? "bg-[#F1F5F9]/40" : ""
              }`}
            >
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                  {(owner.name?.[0] ?? owner.email[0]).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {owner.name ?? "(no name)"}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate font-[family-name:var(--font-inter)]">
                    {owner.email}
                  </p>
                  <p className="text-xs text-on-surface-variant sm:hidden mt-1 font-[family-name:var(--font-inter)]">
                    {owner._count.shops} shop(s) · joined{" "}
                    {new Date(owner.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-24 text-right text-sm font-semibold text-on-surface tabular-nums">
                {owner._count.shops}
              </div>
              <div className="hidden sm:block w-32 text-right text-xs text-on-surface-variant font-[family-name:var(--font-inter)]">
                {new Date(owner.createdAt).toLocaleDateString("en-IN")}
              </div>
              <Link
                href={`/admin/owners/${owner.id}`}
                className="w-20 text-right text-sm text-primary hover:underline font-medium font-[family-name:var(--font-inter)] inline-flex items-center justify-end gap-1"
              >
                View
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
              </Link>
            </div>
          ))}
          {owners.length === 0 && (
            <div className="px-5 py-12 text-center text-on-surface-variant text-sm">
              No owners found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

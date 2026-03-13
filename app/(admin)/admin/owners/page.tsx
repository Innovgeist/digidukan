import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

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
      ...(q ? { OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ]} : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { shops: { where: { deletedAt: null } } } },
    },
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Owners ({owners.length})</h1>
        <Link
          href="/admin/owners/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Create Owner
        </Link>
      </div>

      {/* Search */}
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {owners.map((owner) => (
          <div key={owner.id} className="flex items-center justify-between px-5 py-4">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm">{owner.name ?? "(no name)"}</p>
              <p className="text-xs text-gray-500">{owner.email} · {owner._count.shops} shop(s)</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Joined {new Date(owner.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <Link
              href={`/admin/owners/${owner.id}`}
              className="text-sm text-blue-600 hover:underline ml-4 flex-shrink-0"
            >
              View
            </Link>
          </div>
        ))}
        {owners.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No owners found.</div>
        )}
      </div>
    </div>
  );
}

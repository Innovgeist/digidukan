import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Redirect to onboarding if not complete
  const profile = await prisma.ownerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.onboardingDone) {
    redirect("/onboarding");
  }

  const shops = await prisma.shop.findMany({
    where: { ownerId: session.user.id, deletedAt: null },
    include: {
      _count: { select: { items: { where: { deletedAt: null } } } },
      subscription: { include: { plan: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h1>
        <Link
          href="/shops/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + New Shop
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">You don&apos;t have any shops yet.</p>
          <Link
            href="/onboarding"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
          >
            Set up your first shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{shop.name}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      shop.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : shop.status === "SUSPENDED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {shop.status.toLowerCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  /s/{shop.slug} · {shop._count.items} items ·{" "}
                  {shop.subscription?.plan.name ?? "Free"}
                </p>
              </div>
              <div className="flex gap-2">
                {shop.status === "PUBLISHED" && (
                  <Link
                    href={`/s/${shop.slug}`}
                    target="_blank"
                    className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/shops/${shop.id}`}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

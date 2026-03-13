import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NewAdminShopForm } from "./NewAdminShopForm";

export default async function NewAdminShopPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const owners = await prisma.user.findMany({
    where: { role: "OWNER" },
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-xl space-y-6">
      <Link
        href="/admin/shops"
        className="text-sm text-gray-500 hover:text-gray-700 inline-block"
      >
        ← All Shops
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Shop</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a shop on behalf of an existing owner account.
        </p>
      </div>

      <NewAdminShopForm owners={owners} />
    </div>
  );
}

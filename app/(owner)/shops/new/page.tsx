import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { canCreateShop } from "@/lib/plan";
import { NewShopForm } from "./NewShopForm";

export default async function NewShopPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const check = await canCreateShop(session.user.id);
  if (!check.allowed) redirect("/shops");

  return (
    <div className="p-6 max-w-2xl">
      <a href="/shops" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">← My Shops</a>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Shop</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewShopForm />
      </div>
    </div>
  );
}

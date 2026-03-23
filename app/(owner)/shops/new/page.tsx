import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Crown } from "lucide-react";
import { canCreateShop } from "@/lib/plan";
import { NewShopForm } from "./NewShopForm";

export default async function NewShopPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const check = await canCreateShop(session.user.id);

  if (!check.allowed) {
    return (
      <div className="p-6 lg:p-8 max-w-lg">
        <Link href="/shops" className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium mb-6">
          <ArrowLeft className="w-4 h-4" />
          My Shops
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Shop Limit Reached</h1>
          <p className="text-sm text-gray-500 mb-1">
            You&apos;ve used {check.current} of {check.limit} shop{check.limit !== 1 ? "s" : ""} on your current plan.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Upgrade to the Paid plan to create up to 3 shops with unlimited categories, collections, and full analytics.
          </p>
          <div className="space-y-3">
            <a
              href="mailto:sales@innovgeist.com"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Contact Sales
            </a>
            <p className="text-xs text-gray-400">
              Email{" "}
              <a href="mailto:sales@innovgeist.com" className="text-blue-600 hover:underline">sales@innovgeist.com</a>
              {" "}or call{" "}
              <a href="tel:+919305602733" className="text-blue-600 hover:underline">+91-9305602733</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <Link href="/shops" className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium mb-3">
        <ArrowLeft className="w-4 h-4" />
        My Shops
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Shop</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewShopForm />
      </div>
    </div>
  );
}

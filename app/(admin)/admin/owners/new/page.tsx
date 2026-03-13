import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NewOwnerForm } from "./NewOwnerForm";

export default async function NewOwnerPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  return (
    <div className="p-6 max-w-lg">
      <Link href="/admin/owners" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← All Owners
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Owner Account</h1>
      <NewOwnerForm />
    </div>
  );
}

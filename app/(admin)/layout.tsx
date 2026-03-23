import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminNav email={session.user.email ?? ""} />
      <main className="flex-1 overflow-auto lg:h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

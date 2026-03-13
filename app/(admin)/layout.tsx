import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/owner/SignOutButton";

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
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-56 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <Link href="/admin" className="text-xl font-bold text-white">
            DigiDukan
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <AdminNavLink href="/admin">Overview</AdminNavLink>
          <AdminNavLink href="/admin/owners">Owners</AdminNavLink>
          <AdminNavLink href="/admin/shops">Shops</AdminNavLink>
          <AdminNavLink href="/admin/plans">Plans</AdminNavLink>
          <AdminNavLink href="/admin/logs">Logs</AdminNavLink>
          <AdminNavLink href="/admin/flags">Flags</AdminNavLink>
        </nav>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-xs text-gray-400 mb-2 truncate">{session.user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}

function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg px-3 py-2"
    >
      {children}
    </Link>
  );
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SignOutButton } from "@/components/owner/SignOutButton";
import { ImpersonationBannerWrapper } from "@/components/storefront/ImpersonationBannerWrapper";

interface ImpersonationCookiePayload {
  targetUserId: string;
  logId: string;
  adminId: string;
  targetName: string;
}

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Check for active impersonation session
  const cookieStore = await cookies();
  const impersonateCookie = cookieStore.get("digidukan_impersonate")?.value;

  let impersonation: ImpersonationCookiePayload | null = null;
  if (impersonateCookie) {
    try {
      impersonation = JSON.parse(impersonateCookie) as ImpersonationCookiePayload;
    } catch {
      // Malformed cookie — ignore
      impersonation = null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Impersonation banner — sits above everything when active */}
      {impersonation?.targetName && (
        <ImpersonationBannerWrapper targetName={impersonation.targetName} />
      )}

      {/* Push content down so it isn't hidden behind the fixed banner */}
      {impersonation?.targetName && <div className="h-10" aria-hidden="true" />}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-4">
          <div className="mb-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              DigiDukan
            </Link>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/shops">My Shops</NavLink>
          </nav>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs text-gray-500 mb-1 truncate">{session.user.email}</p>
            <SignOutButton />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2"
    >
      {children}
    </Link>
  );
}

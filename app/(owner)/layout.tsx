import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { OwnerNav } from "@/components/owner/OwnerNav";
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

  const cookieStore = await cookies();
  const impersonateCookie = cookieStore.get("digidukan_impersonate")?.value;

  let impersonation: ImpersonationCookiePayload | null = null;
  if (impersonateCookie) {
    try {
      impersonation = JSON.parse(impersonateCookie) as ImpersonationCookiePayload;
    } catch {
      impersonation = null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {impersonation?.targetName && (
        <ImpersonationBannerWrapper targetName={impersonation.targetName} />
      )}
      {impersonation?.targetName && <div className="h-10" aria-hidden="true" />}

      <div className="flex flex-1">
        <OwnerNav email={session.user.email ?? ""} />
        <main className="flex-1 overflow-auto bg-gray-50 lg:h-screen pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

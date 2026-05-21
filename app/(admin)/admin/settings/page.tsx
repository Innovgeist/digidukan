import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSignupCode } from "@/lib/settings";
import { SignupCodeForm } from "./SignupCodeForm";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const currentCode = await getSignupCode();

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <header className="mb-6">
        <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface mb-1">
          Settings
        </h1>
        <p className="text-base text-on-surface-variant">
          Global platform settings managed by super admins.
        </p>
      </header>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-6 max-w-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-on-surface mb-1">
            Signup invitation code
          </h2>
          <p className="text-sm text-on-surface-variant font-[family-name:var(--font-inter)]">
            A single global code required to register a new account. Sign-in
            is not affected.
          </p>
        </div>
        <SignupCodeForm initialValue={currentCode} />
      </section>
    </div>
  );
}

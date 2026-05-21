import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.ownerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (profile?.onboardingDone) redirect("/dashboard");

  const firstShop = await prisma.shop.findFirst({
    where: { ownerId: session.user.id, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: { branding: true },
  });

  const currentStep = (profile?.onboardingStep ?? 0) + 1;
  const percent = Math.round((currentStep / 7) * 100);

  return (
    <div className="min-h-screen bg-bg-app font-[family-name:var(--font-jakarta)] text-on-background flex items-start sm:items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-lg">
        <div className="flex justify-center items-center mb-6">
          <span className="text-primary text-2xl font-bold tracking-tight flex items-center gap-2">
            <Image src="/logo.png" alt="DigiDukan" width={28} height={28} />
            DigiDukan
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 md:p-8 shadow-stitch-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wider text-outline uppercase">
                  Account Setup
                </span>
                <span className="font-[family-name:var(--font-inter)] text-sm font-semibold text-primary">
                  Step {currentStep} of 7
                </span>
              </div>
              <span className="font-[family-name:var(--font-inter)] text-[12px] font-semibold text-on-surface-variant">
                {percent}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <OnboardingWizard
            initialStep={profile?.onboardingStep ?? 0}
            user={{ name: session.user.name ?? "", email: session.user.email ?? "" }}
            existingShop={
              firstShop
                ? { id: firstShop.id, slug: firstShop.slug, name: firstShop.name }
                : null
            }
          />
        </div>

        <div className="mt-6 text-center">
          <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant">
            Need help?{" "}
            <a className="text-primary hover:underline font-medium" href="mailto:support@digidukan.com">
              Contact Support
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

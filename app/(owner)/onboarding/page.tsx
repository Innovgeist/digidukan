import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.ownerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (profile?.onboardingDone) redirect("/dashboard");

  // Find first shop created (if step >= 3)
  const firstShop = await prisma.shop.findFirst({
    where: { ownerId: session.user.id, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: { branding: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">DigiDukan Setup</h1>
          <p className="text-gray-500 text-sm mt-1">
            Step {(profile?.onboardingStep ?? 0) + 1} of 7
          </p>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${(((profile?.onboardingStep ?? 0) + 1) / 7) * 100}%` }}
            />
          </div>
        </div>
        <OnboardingWizard
          initialStep={profile?.onboardingStep ?? 0}
          user={{ name: session.user.name ?? "", email: session.user.email ?? "" }}
          existingShop={firstShop ? { id: firstShop.id, slug: firstShop.slug, name: firstShop.name } : null}
        />
      </div>
    </div>
  );
}

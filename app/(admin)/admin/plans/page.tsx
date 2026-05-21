import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Check, Star } from "lucide-react";

export default async function AdminPlansPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const plans = await prisma.plan.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 font-[family-name:var(--font-jakarta)] text-on-surface">
      <div className="mb-6">
        <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-on-surface mb-1">
          Plans
        </h1>
        <p className="text-base text-on-surface-variant">
          Manage subscription tiers, limits, and feature flags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isPaid = plan.planType !== "FREE";
          return (
            <div
              key={plan.id}
              className={`rounded-xl border shadow-stitch-1 p-6 flex flex-col ${
                isPaid
                  ? "border-primary-fixed bg-gradient-to-br from-surface-container-lowest to-surface-container-low"
                  : "border-outline-variant/30 bg-surface-container-lowest"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-semibold text-on-surface">
                      {plan.name}
                    </h2>
                    {isPaid && (
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-[family-name:var(--font-inter)] text-[12px] font-semibold flex items-center gap-1 border border-tertiary/20">
                        <Star
                          className="w-3 h-3"
                          strokeWidth={2.4}
                          fill="currentColor"
                        />
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant font-[family-name:var(--font-inter)] uppercase tracking-wide">
                    {plan.planType}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-[family-name:var(--font-inter)] font-semibold border ${
                    plan.isActive
                      ? "bg-secondary/10 text-secondary border-secondary/20"
                      : "bg-surface-variant text-on-surface-variant border-outline-variant/40"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-y border-outline-variant/30 py-4">
                <Limit label="Shops" value={plan.maxShops} />
                <Limit label="Items" value={plan.maxItems} />
                <Limit label="Categories" value={plan.maxCategories} />
                <Limit label="Collections" value={plan.maxCollections} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {plan.analyticsEnabled && <FeatureChip label="Analytics" />}
                {plan.pdfExportEnabled && <FeatureChip label="PDF Export" />}
                {!plan.watermarkEnabled && <FeatureChip label="No Watermark" />}
                {plan.customBranding && <FeatureChip label="Custom Branding" />}
                {plan.watermarkEnabled && (
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-[family-name:var(--font-inter)] font-medium">
                    Watermark shown
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Limit({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-on-surface tabular-nums">
        {value === -1 ? "∞" : value}
      </p>
      <p className="text-xs text-on-surface-variant font-[family-name:var(--font-inter)] mt-0.5">
        {label}
      </p>
    </div>
  );
}

function FeatureChip({ label }: { label: string }) {
  return (
    <span className="text-xs bg-primary-container/10 text-primary px-2.5 py-1 rounded-full font-[family-name:var(--font-inter)] font-semibold inline-flex items-center gap-1">
      <Check className="w-3.5 h-3.5" strokeWidth={2.4} />
      {label}
    </span>
  );
}

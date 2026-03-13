import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminPlansPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const plans = await prisma.plan.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Plans</h1>
      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-semibold text-gray-900">{plan.name}</h2>
                <p className="text-xs text-gray-500">{plan.planType}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center border-t border-gray-100 pt-3">
              <Limit label="Shops" value={plan.maxShops} />
              <Limit label="Items" value={plan.maxItems} />
              <Limit label="Categories" value={plan.maxCategories} />
              <Limit label="Collections" value={plan.maxCollections} />
            </div>
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {plan.analyticsEnabled && <FeatureChip label="Analytics" />}
              {plan.pdfExportEnabled && <FeatureChip label="PDF Export" />}
              {!plan.watermarkEnabled && <FeatureChip label="No Watermark" />}
              {plan.customBranding && <FeatureChip label="Custom Branding" />}
              {plan.watermarkEnabled && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Watermark shown</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Limit({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-lg font-bold text-gray-900">{value === -1 ? "∞" : value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function FeatureChip({ label }: { label: string }) {
  return (
    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{label}</span>
  );
}

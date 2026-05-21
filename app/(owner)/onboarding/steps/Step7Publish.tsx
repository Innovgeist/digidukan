"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Rocket, ExternalLink, PartyPopper } from "lucide-react";
import { publishShopAction, advanceOnboardingStep } from "@/lib/actions/shop";

interface Props {
  shopId: string | null;
  shopSlug: string | null;
}

export function Step7Publish({ shopId, shopSlug }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  async function handlePublish() {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    const result = await publishShopAction(shopId);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    await advanceOnboardingStep(7);
    setPublished(true);
    setLoading(false);
  }

  if (published) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center mx-auto">
          <PartyPopper className="w-8 h-8 text-secondary" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
            Your shop is live!
          </h1>
          <p className="text-base text-on-surface-variant mt-1">
            Share this link with your customers.
          </p>
        </div>

        {shopSlug && (
          <div className="bg-surface-container-low rounded-lg p-3 flex items-center gap-2">
            <span className="text-sm text-on-surface flex-1 text-left font-[family-name:var(--font-inter)]">
              digidukan.com/s/{shopSlug}
            </span>
            <Link
              href={`/s/${shopSlug}`}
              target="_blank"
              className="text-primary text-sm hover:underline whitespace-nowrap inline-flex items-center gap-1 font-medium"
            >
              View
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {shopId && (
            <Link
              href={`/shops/${shopId}/qr`}
              className="flex-1 border border-primary text-primary h-12 rounded-lg font-medium hover:bg-surface-container-low text-center inline-flex items-center justify-center font-[family-name:var(--font-inter)] text-sm"
            >
              Download QR
            </Link>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-primary text-on-primary h-12 rounded-lg font-medium hover:bg-on-primary-fixed-variant inline-flex items-center justify-center font-[family-name:var(--font-inter)] text-sm shadow-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          You&apos;re almost there!
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Publish your shop to make it accessible to customers.
        </p>
      </div>

      <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-4 space-y-2">
        <ChecklistRow label="Shop created" />
        <ChecklistRow label="Category added" />
        <ChecklistRow label="Items added" />
      </div>

      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg p-3">
          <p className="text-on-error-container text-sm">{error}</p>
        </div>
      )}

      <div className="pt-2 border-t border-surface-variant flex flex-col gap-3">
        <button
          onClick={handlePublish}
          disabled={loading}
          className="w-full bg-secondary text-on-secondary h-12 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2 font-[family-name:var(--font-inter)] text-sm shadow-sm"
        >
          <Rocket className="w-[18px] h-[18px]" strokeWidth={2.4} />
          {loading ? "Publishing..." : "Publish My Shop"}
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full text-on-surface-variant text-sm hover:underline font-[family-name:var(--font-inter)]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function ChecklistRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-primary font-medium">
      <CheckCircle2 className="w-4 h-4" strokeWidth={2.4} />
      <span>{label}</span>
    </div>
  );
}

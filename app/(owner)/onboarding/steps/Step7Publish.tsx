"use client";
import { useState } from "react";
import { publishShopAction, advanceOnboardingStep } from "@/lib/actions/shop";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props { shopId: string | null; shopSlug: string | null }

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
    if (result.error) { setError(result.error); setLoading(false); return; }
    await advanceOnboardingStep(7);
    setPublished(true);
    setLoading(false);
  }

  if (published) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your shop is live!</h2>
        <p className="text-gray-500 text-sm mb-6">Share this link with your customers.</p>
        {shopSlug && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-600 flex-1 text-left">/s/{shopSlug}</span>
            <Link href={`/s/${shopSlug}`} target="_blank" className="text-blue-600 text-sm hover:underline whitespace-nowrap">
              View →
            </Link>
          </div>
        )}
        <div className="flex gap-3">
          {shopId && (
            <Link
              href={`/shops/${shopId}/qr`}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 text-center text-sm"
            >
              Download QR
            </Link>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">You&apos;re almost there!</h2>
      <p className="text-gray-500 text-sm mb-6">Publish your shop to make it accessible to customers.</p>

      <div className="bg-blue-50 rounded-xl p-4 mb-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <span>✓</span><span>Shop created</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <span>✓</span><span>Category added</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <span>✓</span><span>Items added</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handlePublish}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 mb-3"
      >
        {loading ? "Publishing..." : "🚀 Publish My Shop"}
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        className="w-full text-gray-500 text-sm hover:underline"
      >
        Skip for now
      </button>
    </div>
  );
}

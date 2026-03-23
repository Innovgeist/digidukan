"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { publishShopAction, unpublishShopAction } from "@/lib/actions/shop";

interface Props {
  shop: { id: string; status: string; slug: string };
}

export function ShopActions({ shop }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setLoading(true);
    setError(null);
    const result = await publishShopAction(shop.id);
    if (result.error) { setError(result.error); toast.error(result.error); }
    else { toast.success("Shop published!"); router.refresh(); }
    setLoading(false);
  }

  async function handleUnpublish() {
    setLoading(true);
    const result = await unpublishShopAction(shop.id);
    if (result.success) { toast.success("Shop unpublished"); router.refresh(); }
    else { toast.error("Failed to unpublish shop"); }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2 justify-end">
        {shop.status === "PUBLISHED" && (
          <Link
            href={`/s/${shop.slug}`}
            target="_blank"
            className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            View Live
          </Link>
        )}
        <Link
          href={`/shops/${shop.id}/settings`}
          className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          Edit Shop
        </Link>
        {shop.status === "DRAFT" || shop.status === "SUSPENDED" ? (
          <button
            onClick={handlePublish}
            disabled={loading}
            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "..." : "Publish"}
          </button>
        ) : shop.status === "PUBLISHED" ? (
          <button
            onClick={handleUnpublish}
            disabled={loading}
            className="text-sm bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "..." : "Unpublish"}
          </button>
        ) : null}
      </div>
      {error && <p className="text-red-500 text-xs max-w-xs text-right">{error}</p>}
    </div>
  );
}

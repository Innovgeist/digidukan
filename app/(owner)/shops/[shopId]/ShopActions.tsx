"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, Store } from "lucide-react";
import { publishShopAction, unpublishShopAction } from "@/lib/actions/shop";

interface Props {
  shop: { id: string; status: string; slug: string };
}

export function ShopActions({ shop }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    setLoading(true);
    const result = await publishShopAction(shop.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Shop published!");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleUnpublish() {
    setLoading(true);
    const result = await unpublishShopAction(shop.id);
    if (result.success) {
      toast.success("Shop unpublished");
      router.refresh();
    } else {
      toast.error("Failed to unpublish shop");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end font-[family-name:var(--font-inter)]">
      {shop.status === "PUBLISHED" && (
        <Link
          href={`/s/${shop.slug}`}
          target="_blank"
          className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
          View Store
        </Link>
      )}
      <Link
        href={`/shops/${shop.id}/settings`}
        className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Pencil className="w-[18px] h-[18px]" strokeWidth={2} />
        Edit Shop
      </Link>
      {(shop.status === "DRAFT" || shop.status === "SUSPENDED") && (
        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-4 py-2 bg-secondary text-on-secondary text-sm font-medium rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
        >
          <Store className="w-[18px] h-[18px]" strokeWidth={2} />
          {loading ? "Publishing..." : "Publish"}
        </button>
      )}
      {shop.status === "PUBLISHED" && (
        <button
          onClick={handleUnpublish}
          disabled={loading}
          className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
        >
          <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
          {loading ? "..." : "Unpublish"}
        </button>
      )}
    </div>
  );
}

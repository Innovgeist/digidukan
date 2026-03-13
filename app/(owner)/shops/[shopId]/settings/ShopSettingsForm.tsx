"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateShopSettingsAction, upsertShopBannerAction } from "@/lib/actions/shop";

interface Props {
  shopId: string;
  isOpen: boolean;
  banner: { text: string; isActive: boolean; expiresAt: string } | null;
}

export function ShopSettingsForm({ shopId, isOpen, banner }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(isOpen);
  const [bannerText, setBannerText] = useState(banner?.text ?? "");
  const [bannerActive, setBannerActive] = useState(banner?.isActive ?? false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleToggleOpen() {
    setLoading(true);
    await updateShopSettingsAction(shopId, { isOpen: !open, businessHoursEnabled: false });
    setOpen(!open);
    setLoading(false);
    router.refresh();
  }

  async function saveBanner() {
    setLoading(true); setSuccess(false);
    await upsertShopBannerAction(shopId, { text: bannerText, isActive: bannerActive });
    setSuccess(true); setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Open / Closed toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900 text-sm">Shop Status</p>
          <p className="text-xs text-gray-500 mt-0.5">Customers see {open ? "Open" : "Closed"} on your storefront</p>
        </div>
        <button
          onClick={handleToggleOpen}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${open ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${open ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {/* Offer Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <p className="font-medium text-gray-900 text-sm">Offer Banner</p>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Banner Text</label>
          <input value={bannerText} onChange={(e) => setBannerText(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10% off on all sweets this Diwali! 🪔" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={bannerActive} onChange={(e) => setBannerActive(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
          <span className="text-sm text-gray-700">Show banner on storefront</span>
        </label>
        {success && <p className="text-green-600 text-xs">Banner saved!</p>}
        <button onClick={saveBanner} disabled={loading || !bannerText.trim()} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </div>
    </div>
  );
}

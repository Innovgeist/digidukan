"use client";
import { useState } from "react";
import { updateShopBrandingAction, advanceOnboardingStep } from "@/lib/actions/shop";
import { ImageUpload } from "@/components/owner/ImageUpload";

interface Props { onNext: () => void; shopId: string | null; shopSlug: string | null }

export function Step4Branding({ onNext, shopId }: Props) {
  const [color, setColor] = useState("#3B82F6");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPublicId, setLogoPublicId] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    if (shopId) {
      await updateShopBrandingAction(shopId, { primaryColor: color, logoUrl, logoPublicId, coverUrl, coverPublicId });
    }
    await advanceOnboardingStep(4);
    onNext();
  }

  async function handleSkip() {
    await advanceOnboardingStep(4);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Brand your shop</h2>
      <p className="text-gray-500 text-sm mb-6">Add a logo, cover, and color. You can skip and do this later.</p>

      <div className="space-y-5 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo</label>
          {shopId && (
            <ImageUpload
              folder={`shops/${shopId}/logo`}
              value={logoUrl}
              onChange={(url, publicId) => { setLogoUrl(url); setLogoPublicId(publicId); }}
              label="Upload Logo"
              aspectHint="Square, 400×400px recommended"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          {shopId && (
            <ImageUpload
              folder={`shops/${shopId}/cover`}
              value={coverUrl}
              onChange={(url, publicId) => { setCoverUrl(url); setCoverPublicId(publicId); }}
              label="Upload Cover"
              aspectHint="Wide, 1200×400px recommended"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#3B82F6"
            />
            <div className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSkip}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50"
        >
          Skip for now
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Continue →"}
        </button>
      </div>
    </div>
  );
}

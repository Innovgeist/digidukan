"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { updateShopBrandingAction, advanceOnboardingStep } from "@/lib/actions/shop";
import { ImageUpload } from "@/components/owner/ImageUpload";

interface Props {
  onNext: () => void;
  shopId: string | null;
  shopSlug: string | null;
}

export function Step4Branding({ onNext, shopId }: Props) {
  const [color, setColor] = useState("#004ac6");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPublicId, setLogoPublicId] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    if (shopId) {
      await updateShopBrandingAction(shopId, {
        primaryColor: color,
        logoUrl,
        logoPublicId,
        coverUrl,
        coverPublicId,
      });
    }
    await advanceOnboardingStep(4);
    onNext();
  }

  async function handleSkip() {
    await advanceOnboardingStep(4);
    onNext();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          Brand your shop
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Add a logo, cover, and color. You can skip and do this later.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
            Shop Logo
          </label>
          {shopId && (
            <ImageUpload
              folder={`shops/${shopId}/logo`}
              value={logoUrl}
              onChange={(url, publicId) => {
                setLogoUrl(url);
                setLogoPublicId(publicId);
              }}
              label="Upload Logo"
              aspectHint="Square, 400×400px recommended"
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
            Cover Image
          </label>
          {shopId && (
            <ImageUpload
              folder={`shops/${shopId}/cover`}
              value={coverUrl}
              onChange={(url, publicId) => {
                setCoverUrl(url);
                setCoverPublicId(publicId);
              }}
              label="Upload Cover"
              aspectHint="Wide, 1200×400px recommended"
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded-lg border border-outline-variant cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border border-outline-variant rounded-lg px-3 h-12 text-base w-32 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface-container-lowest"
              placeholder="#004ac6"
            />
            <div
              className="w-12 h-12 rounded-full border border-outline-variant"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-surface-variant flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={handleSkip}
          className="border border-primary text-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-6 rounded-lg hover:bg-surface-container-low transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Continue"}
          {!loading && <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />}
        </button>
      </div>
    </div>
  );
}

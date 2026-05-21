"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Plus, Trash2, X, Loader2, ArrowRight } from "lucide-react";
import { createItemAction } from "@/lib/actions/item";
import { advanceOnboardingStep } from "@/lib/actions/shop";
import { uploadImageAction } from "@/lib/actions/upload";

interface Props {
  onNext: () => void;
  shopId: string | null;
  shopSlug: string | null;
}

interface QuickItem {
  name: string;
  price: string;
  imageUrl: string;
  imagePublicId: string;
  uploading: boolean;
  uploadError?: string;
}

const EMPTY_ITEM: QuickItem = {
  name: "",
  price: "",
  imageUrl: "",
  imagePublicId: "",
  uploading: false,
};

export function Step6Items({ onNext, shopId }: Props) {
  const [items, setItems] = useState<QuickItem[]>([{ ...EMPTY_ITEM }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRefs = useRef<Array<HTMLInputElement | null>>([]);

  function patchItem(i: number, patch: Partial<QuickItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function addItem() {
    if (items.length < 3) setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(i: number) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function handleImage(i: number, file: File | undefined) {
    if (!file || !shopId) return;
    patchItem(i, { uploading: true, uploadError: undefined });

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImageAction(formData, `shops/${shopId}/items`);

    if (result.error) {
      patchItem(i, { uploading: false, uploadError: result.error });
    } else if (result.url && result.publicId) {
      patchItem(i, {
        uploading: false,
        imageUrl: result.url,
        imagePublicId: result.publicId,
      });
    } else {
      patchItem(i, { uploading: false });
    }

    const ref = fileRefs.current[i];
    if (ref) ref.value = "";
  }

  function clearImage(i: number) {
    patchItem(i, { imageUrl: "", imagePublicId: "" });
  }

  async function handleSubmit() {
    if (!shopId) return;
    setLoading(true);
    setError(null);

    const validItems = items.filter((it) => it.name.trim() && it.price.trim());
    if (validItems.length === 0) {
      setError("Add at least 1 item to continue.");
      setLoading(false);
      return;
    }

    for (const item of validItems) {
      const result = await createItemAction(shopId, {
        name: item.name,
        price: item.price,
        itemType: "PRODUCT",
        isAvailable: true,
        isFeatured: false,
        isBestseller: false,
        displayOrder: 0,
        dietaryType: "NA",
        imageUrl: item.imageUrl || undefined,
        imagePublicId: item.imagePublicId || undefined,
      });
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    }

    await advanceOnboardingStep(6);
    onNext();
  }

  const allUploading = items.some((it) => it.uploading);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          Add your first items
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Add 1–3 items with photos to get started. You can add more later.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-outline-variant rounded-xl p-3 bg-surface-container-lowest flex gap-3 items-start shadow-stitch-1"
          >
            <button
              type="button"
              onClick={() => !item.uploading && fileRefs.current[i]?.click()}
              disabled={item.uploading}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                item.imageUrl
                  ? "border-outline-variant"
                  : "border-dashed border-outline-variant hover:border-primary hover:bg-primary-container/10"
              }`}
            >
              {item.uploading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </span>
              ) : item.imageUrl ? (
                <>
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage(i);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        clearImage(i);
                      }
                    }}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" strokeWidth={2.6} />
                  </span>
                </>
              ) : (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-outline">
                  <ImagePlus className="w-5 h-5" strokeWidth={1.8} />
                  <span className="text-[10px] font-medium font-[family-name:var(--font-inter)]">
                    Photo
                  </span>
                </span>
              )}
            </button>
            <input
              ref={(el) => {
                fileRefs.current[i] = el;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(i, e.target.files?.[0])}
            />

            <div className="flex-1 space-y-2 min-w-0">
              <input
                value={item.name}
                onChange={(e) => patchItem(i, { name: e.target.value })}
                placeholder={`Item ${i + 1} name`}
                className="w-full border border-outline-variant rounded-lg px-3 h-11 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="bg-surface-container-low text-on-surface-variant text-base px-3 h-11 flex items-center border-r border-outline-variant">
                    ₹
                  </span>
                  <input
                    inputMode="decimal"
                    value={item.price}
                    onChange={(e) => patchItem(i, { price: e.target.value })}
                    placeholder="Price"
                    className="flex-1 px-2 h-11 text-base focus:outline-none w-0 bg-surface-container-lowest"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    aria-label="Remove item"
                    className="w-11 h-11 rounded-lg border border-outline-variant text-outline hover:text-error hover:bg-error-container hover:border-error/40 flex items-center justify-center flex-shrink-0 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {item.uploadError && (
                <p className="text-xs text-error">{item.uploadError}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length < 3 && (
        <button
          onClick={addItem}
          className="w-full inline-flex items-center justify-center gap-1.5 text-primary hover:bg-primary-container/10 text-sm font-medium font-[family-name:var(--font-inter)] py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Add another item
        </button>
      )}

      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg p-3">
          <p className="text-on-error-container text-sm">{error}</p>
        </div>
      )}

      <div className="pt-2 border-t border-surface-variant flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || allUploading}
          className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 w-full sm:w-auto"
        >
          {loading
            ? "Saving items..."
            : allUploading
              ? "Wait for image upload…"
              : "Save & Continue"}
          {!loading && !allUploading && (
            <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />
          )}
        </button>
      </div>
    </div>
  );
}

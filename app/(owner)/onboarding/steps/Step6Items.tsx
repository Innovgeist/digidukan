"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Plus, Trash2, X, Loader2 } from "lucide-react";
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
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Add your first items</h2>
      <p className="text-gray-500 text-sm mb-5">
        Add 1–3 items with photos to get started. You can add more anytime later.
      </p>

      <div className="space-y-3 mb-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-3 bg-white flex gap-3 items-start"
          >
            {/* Image picker */}
            <button
              type="button"
              onClick={() => !item.uploading && fileRefs.current[i]?.click()}
              disabled={item.uploading}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                item.imageUrl
                  ? "border-gray-200"
                  : "border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {item.uploading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-white">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </span>
              ) : item.imageUrl ? (
                <>
                  <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="80px" unoptimized />
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
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-gray-400">
                  <ImagePlus className="w-5 h-5" strokeWidth={1.8} />
                  <span className="text-[10px] font-medium">Photo</span>
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

            {/* Fields */}
            <div className="flex-1 space-y-2 min-w-0">
              <input
                value={item.name}
                onChange={(e) => patchItem(i, { name: e.target.value })}
                placeholder={`Item ${i + 1} name`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="bg-gray-50 text-gray-500 text-sm px-3 py-2.5 border-r border-gray-300">₹</span>
                  <input
                    inputMode="decimal"
                    value={item.price}
                    onChange={(e) => patchItem(i, { price: e.target.value })}
                    placeholder="Price"
                    className="flex-1 px-2 py-2.5 text-sm focus:outline-none w-0"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    aria-label="Remove item"
                    className="w-10 h-10 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center flex-shrink-0 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {item.uploadError && (
                <p className="text-xs text-red-500">{item.uploadError}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length < 3 && (
        <button
          onClick={addItem}
          className="w-full inline-flex items-center justify-center gap-1.5 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2.5 rounded-lg mb-4 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Add another item
        </button>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || allUploading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Saving items..." : allUploading ? "Wait for image upload…" : "Save & Continue →"}
      </button>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createItemAction, updateItemAction } from "@/lib/actions/item";
import { CreateItemSchema, type CreateItemInput } from "@/lib/validations/item";
import { ImageUpload } from "./ImageUpload";

interface Props {
  shopId: string;
  itemId?: string;
  categories: { id: string; name: string }[];
  businessType: string;
  defaultValues?: Partial<CreateItemInput>;
}

export function ItemForm({ shopId, itemId, categories, businessType, defaultValues }: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? "");
  const [imagePublicId, setImagePublicId] = useState(defaultValues?.imagePublicId ?? "");
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateItemInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateItemSchema) as any,
    defaultValues: {
      name: "", itemType: "PRODUCT", price: "", oldPrice: "",
      categoryId: "", description: "", isAvailable: true,
      isFeatured: false, isBestseller: false, displayOrder: 0, dietaryType: "NA",
      ...defaultValues,
    },
  });

  const itemType = watch("itemType");
  const showDietary = businessType !== "SERVICE" && itemType === "PRODUCT";

  async function onSubmit(data: CreateItemInput) {
    setLoading(true);
    setServerError(null);

    const payload = { ...data, imageUrl, imagePublicId };
    const result = itemId
      ? await updateItemAction(itemId, payload)
      : await createItemAction(shopId, payload);

    if (result.error) { setServerError(result.error); setLoading(false); return; }
    router.push(`/shops/${shopId}/items`);
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Image */}
      <div>
        <label className={labelClass}>Item Image</label>
        <ImageUpload
          folder={`shops/${shopId}/items`}
          value={imageUrl}
          onChange={(url, pid) => { setImageUrl(url); setImagePublicId(pid); setValue("imageUrl", url); setValue("imagePublicId", pid); }}
          label="Upload Item Image"
          aspectHint="Square, 400×400px recommended"
        />
      </div>

      {/* Name */}
      <div>
        <label className={labelClass}>Item Name *</label>
        <input {...register("name")} className={inputClass} placeholder="e.g. Gulab Jamun" />
        {errors.name && <p className={errClass}>{errors.name.message}</p>}
      </div>

      {/* Type */}
      <div>
        <label className={labelClass}>Item Type</label>
        <select {...register("itemType")} className={inputClass}>
          <option value="PRODUCT">Product</option>
          <option value="SERVICE">Service</option>
        </select>
      </div>

      {/* Price row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Price (₹) *</label>
          <input {...register("price")} className={inputClass} placeholder="0.00" type="number" step="0.01" min="0" />
          {errors.price && <p className={errClass}>{errors.price.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Old Price (₹)</label>
          <input {...register("oldPrice")} className={inputClass} placeholder="0.00" type="number" step="0.01" min="0" />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select {...register("categoryId")} className={inputClass}>
          <option value="">— No category —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register("description")} className={inputClass} rows={2} placeholder="Brief description (optional)" />
      </div>

      {/* Dietary */}
      {showDietary && (
        <div>
          <label className={labelClass}>Dietary Type</label>
          <select {...register("dietaryType")} className={inputClass}>
            <option value="NA">Not Applicable</option>
            <option value="VEG">🟢 Veg</option>
            <option value="NON_VEG">🔴 Non-Veg</option>
            <option value="EGG">🥚 Egg</option>
          </select>
        </div>
      )}

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ToggleField register={register as any} name="isAvailable" label="Available" />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ToggleField register={register as any} name="isFeatured" label="Featured" />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ToggleField register={register as any} name="isBestseller" label="Bestseller" />
      </div>

      {serverError && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{serverError}</p></div>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push(`/shops/${shopId}/items`)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Saving..." : itemId ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToggleField({ register, name, label }: { register: (name: string) => any; name: string; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input {...register(name)} type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

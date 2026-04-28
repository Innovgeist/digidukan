"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UpdateShopSchema, type UpdateShopInput } from "@/lib/validations/shop";
import { updateShopAction, checkSlugAction } from "@/lib/actions/shop";

interface Props { shopId: string; defaultValues: UpdateShopInput }

export function ShopEditForm({ shopId, defaultValues }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [slugWarning, setSlugWarning] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<UpdateShopInput>({
    resolver: zodResolver(UpdateShopSchema),
    defaultValues,
  });

  const slugValue = watch("slug");
  const slugChanged = slugValue !== defaultValues.slug;

  async function onSubmit(data: UpdateShopInput) {
    setLoading(true); setServerError(null); setSuccess(false);
    if (slugChanged) {
      const check = await checkSlugAction(data.slug!, shopId);
      if (!check.available) { setServerError("This URL is already taken."); setLoading(false); return; }
    }
    const result = await updateShopAction(shopId, data);
    if (result.error) { setServerError(result.error); setLoading(false); return; }
    setSuccess(true); setLoading(false);
    router.refresh();
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Shop Name *</label>
          <input {...register("name")} className={inputClass} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>URL Slug *</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-2 border-r border-gray-300">/s/</span>
            <input {...register("slug")} className="flex-1 px-2 py-2 text-sm focus:outline-none" />
          </div>
          {slugChanged && <p className="text-amber-600 text-xs mt-1">Changing the URL will invalidate old QR codes.</p>}
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Phone *</label>
          <input {...register("phone")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>WhatsApp *</label>
          <input {...register("whatsappNumber")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register("description")} className={inputClass} rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>City</label><input {...register("city")} className={inputClass} /></div>
        <div><label className={labelClass}>State</label><input {...register("state")} className={inputClass} /></div>
      </div>

      <div>
        <label className={labelClass}>Google Maps URL</label>
        <input {...register("mapsUrl")} className={inputClass} placeholder="https://maps.google.com/..." />
      </div>

      {serverError && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{serverError}</p></div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3"><p className="text-green-700 text-sm">Changes saved!</p></div>}

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

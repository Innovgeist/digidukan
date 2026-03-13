"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CreateShopSchema, type CreateShopInput } from "@/lib/validations/shop";
import { createShopAction, generateSlugAction, checkSlugAction } from "@/lib/actions/shop";

export function NewShopForm() {
  const router = useRouter();
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateShopInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateShopSchema) as any,
    defaultValues: { businessType: "MIXED", country: "India" },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  useEffect(() => {
    if (!nameValue || nameValue.length < 2) return;
    const t = setTimeout(async () => { const r = await generateSlugAction(nameValue); setValue("slug", r.slug); }, 500);
    return () => clearTimeout(t);
  }, [nameValue, setValue]);

  useEffect(() => {
    if (!slugValue || slugValue.length < 2) return;
    const t = setTimeout(async () => { const r = await checkSlugAction(slugValue); setSlugAvailable(r.available); }, 400);
    return () => clearTimeout(t);
  }, [slugValue]);

  async function onSubmit(data: CreateShopInput) {
    setLoading(true); setServerError(null);
    const result = await createShopAction(data);
    if (result.error) { setServerError(result.error); setLoading(false); return; }
    router.push(`/shops/${result.shopId}`);
  }

  const ic = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
        <input {...register("name")} className={ic} placeholder="e.g. Sharma Sweets" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shop URL *{" "}
          {slugAvailable === true && <span className="text-green-600 text-xs">✓ available</span>}
          {slugAvailable === false && <span className="text-red-500 text-xs">✗ taken</span>}
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="bg-gray-50 text-gray-500 text-xs px-2 py-2 border-r border-gray-300 whitespace-nowrap">/s/</span>
          <input {...register("slug")} className="flex-1 px-2 py-2 text-sm focus:outline-none" />
        </div>
        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
        <select {...register("businessType")} className={ic}>
          <option value="MIXED">Mixed (Products + Services)</option>
          <option value="RETAIL">Retail (Products)</option>
          <option value="SERVICE">Service</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input {...register("phone")} className={ic} placeholder="9876543210" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
          <input {...register("whatsappNumber")} className={ic} placeholder="9876543210" />
          {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea {...register("description")} className={ic} rows={2} placeholder="Brief description of your shop" />
      </div>

      {serverError && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm">{serverError}</p></div>}

      <button type="submit" disabled={loading || slugAvailable === false} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Creating..." : "Create Shop"}
      </button>
    </form>
  );
}

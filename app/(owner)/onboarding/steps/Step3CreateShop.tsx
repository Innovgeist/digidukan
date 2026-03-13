"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createShopAction, generateSlugAction, checkSlugAction, advanceOnboardingStep } from "@/lib/actions/shop";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
  phone: z.string().min(10, "Enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number"),
});
type FormData = z.infer<typeof schema>;

interface Props { onNext: (shopId: string, slug: string) => void }

export function Step3CreateShop({ onNext }: Props) {
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { slug: "" },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Auto-generate slug from name
  useEffect(() => {
    if (!nameValue || nameValue.length < 2) return;
    const timer = setTimeout(async () => {
      const result = await generateSlugAction(nameValue);
      setValue("slug", result.slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameValue, setValue]);

  // Check slug availability
  useEffect(() => {
    if (!slugValue || slugValue.length < 2) return;
    const timer = setTimeout(async () => {
      const result = await checkSlugAction(slugValue);
      setSlugAvailable(result.available);
    }, 400);
    return () => clearTimeout(timer);
  }, [slugValue]);

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError(null);
    const result = await createShopAction({ ...data, businessType: "MIXED" });
    if (result.error) {
      setServerError(result.error);
      setLoading(false);
      return;
    }
    await advanceOnboardingStep(3);
    onNext(result.shopId!, result.slug!);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Create your shop</h2>
      <p className="text-gray-500 text-sm mb-6">You can edit all details later.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
          <input {...register("name")} placeholder="e.g. Ramesh Sweet House" className="input-field" />
          {errors.name && <p className="err">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop URL *
            {slugAvailable === true && <span className="ml-2 text-green-600 text-xs">✓ available</span>}
            {slugAvailable === false && <span className="ml-2 text-red-500 text-xs">✗ taken</span>}
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="bg-gray-50 text-gray-500 text-sm px-3 py-2 border-r border-gray-300 whitespace-nowrap">/s/</span>
            <input {...register("slug")} placeholder="my-shop-name" className="flex-1 px-3 py-2 text-sm focus:outline-none" />
          </div>
          {errors.slug && <p className="err">{errors.slug.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input {...register("phone")} placeholder="9876543210" className="input-field" />
            {errors.phone && <p className="err">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
            <input {...register("whatsappNumber")} placeholder="9876543210" className="input-field" />
            {errors.whatsappNumber && <p className="err">{errors.whatsappNumber.message}</p>}
          </div>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || slugAvailable === false}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating shop..." : "Create Shop →"}
        </button>
      </form>

      <style jsx>{`
        .input-field { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
        .input-field:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; }
        .err { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; }
      `}</style>
    </div>
  );
}

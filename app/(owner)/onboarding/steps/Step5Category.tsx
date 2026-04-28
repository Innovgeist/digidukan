"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createCategoryAction } from "@/lib/actions/category";
import { advanceOnboardingStep } from "@/lib/actions/shop";

interface Props { onNext: () => void; shopId: string | null; shopSlug: string | null }

export function Step5Category({ onNext, shopId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string }>();

  async function onSubmit(data: { name: string }) {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    const result = await createCategoryAction(shopId, { name: data.name, displayOrder: 0 });
    if (result.error) { setError(result.error); setLoading(false); return; }
    await advanceOnboardingStep(5);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Add your first category</h2>
      <p className="text-gray-500 text-sm mb-6">Categories organise your items (e.g. Sweets, Snacks, T-Shirts).</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
          <input
            {...register("name", { required: "Category name is required" })}
            placeholder="e.g. Sweets"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Category →"}
        </button>
      </form>
    </div>
  );
}

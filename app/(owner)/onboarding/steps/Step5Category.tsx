"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { createCategoryAction } from "@/lib/actions/category";
import { advanceOnboardingStep } from "@/lib/actions/shop";

interface Props {
  onNext: () => void;
  shopId: string | null;
  shopSlug: string | null;
}

export function Step5Category({ onNext, shopId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  async function onSubmit(data: { name: string }) {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    const result = await createCategoryAction(shopId, {
      name: data.name,
      displayOrder: 0,
    });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    await advanceOnboardingStep(5);
    onNext();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          Add your first category
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Categories organise your items (e.g. Sweets, Snacks, T-Shirts).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
            Category Name
          </label>
          <input
            {...register("name", { required: "Category name is required" })}
            placeholder="e.g. Sweets"
            className="w-full h-12 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {errors.name && (
            <p className="text-error text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-error-container border border-error/20 rounded-lg p-3">
            <p className="text-on-error-container text-sm">{error}</p>
          </div>
        )}

        <div className="pt-2 border-t border-surface-variant flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? "Adding..." : "Add Category"}
            {!loading && <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />}
          </button>
        </div>
      </form>
    </div>
  );
}

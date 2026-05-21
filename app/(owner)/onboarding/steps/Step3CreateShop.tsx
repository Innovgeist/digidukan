"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Link2, Check, X } from "lucide-react";
import {
  createShopAction,
  generateSlugAction,
  checkSlugAction,
  advanceOnboardingStep,
} from "@/lib/actions/shop";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
  phone: z.string().min(10, "Enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number"),
});
type FormData = z.infer<typeof schema>;

interface Props {
  onNext: (shopId: string, slug: string) => void;
}

export function Step3CreateShop({ onNext }: Props) {
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { slug: "" },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  useEffect(() => {
    if (!nameValue || nameValue.length < 2) return;
    const timer = setTimeout(async () => {
      const result = await generateSlugAction(nameValue);
      setValue("slug", result.slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameValue, setValue]);

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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          Create your shop
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Let&apos;s establish your digital storefront identity.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Shop Name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="e.g. Ramesh Sweet House"
            className="stitch-input"
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface flex items-center justify-between">
            <span>Shop URL</span>
            {slugAvailable === true && (
              <span className="inline-flex items-center gap-1 text-secondary text-xs font-semibold">
                <Check className="w-3.5 h-3.5" strokeWidth={3} /> available
              </span>
            )}
            {slugAvailable === false && (
              <span className="inline-flex items-center gap-1 text-error text-xs font-semibold">
                <X className="w-3.5 h-3.5" strokeWidth={3} /> taken
              </span>
            )}
          </label>
          <div className="flex rounded-lg border border-outline-variant bg-surface-container-lowest overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="bg-surface-container-low text-on-surface-variant border-r border-outline-variant px-3 flex items-center text-sm whitespace-nowrap font-[family-name:var(--font-inter)]">
              digidukan.com/s/
            </span>
            <input
              {...register("slug")}
              placeholder="your-shop"
              className="flex-1 bg-transparent border-none px-3 py-2 text-base text-on-surface focus:ring-0 focus:outline-none"
            />
          </div>
          {errors.slug && (
            <p className="text-error text-xs mt-1">{errors.slug.message}</p>
          )}
          <div className="text-[12px] text-on-surface-variant mt-1 flex items-center gap-1 font-[family-name:var(--font-inter)]">
            <Link2 className="w-3.5 h-3.5" strokeWidth={2} />
            Preview: digidukan.com/s/{slugValue || "your-shop"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              placeholder="9876543210"
              className="stitch-input"
            />
          </Field>
          <Field label="WhatsApp" error={errors.whatsappNumber?.message}>
            <input
              {...register("whatsappNumber")}
              placeholder="9876543210"
              className="stitch-input"
            />
          </Field>
        </div>

        {serverError && (
          <div className="bg-error-container border border-error/20 rounded-lg p-3">
            <p className="text-on-error-container text-sm">{serverError}</p>
          </div>
        )}

        <div className="pt-2 border-t border-surface-variant flex justify-end">
          <button
            type="submit"
            disabled={loading || slugAvailable === false}
            className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? "Creating shop..." : "Create Shop"}
            {!loading && <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />}
          </button>
        </div>
      </form>

      <style jsx>{`
        :global(.stitch-input) {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border: 1px solid var(--color-outline-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          font-size: 16px;
          line-height: 1.6;
          transition: all 200ms ease;
          font-family: var(--font-jakarta);
        }
        :global(.stitch-input:focus) {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(0, 74, 198, 0.2);
        }
        :global(.stitch-input::placeholder) {
          color: var(--color-outline);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
        {label}
      </label>
      {children}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}

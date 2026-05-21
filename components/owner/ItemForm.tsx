"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
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

export function ItemForm({
  shopId,
  itemId,
  categories,
  businessType,
  defaultValues,
}: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? "");
  const [imagePublicId, setImagePublicId] = useState(
    defaultValues?.imagePublicId ?? ""
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateItemInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateItemSchema) as any,
    defaultValues: {
      name: "",
      itemType: "PRODUCT",
      price: "",
      oldPrice: "",
      categoryId: "",
      description: "",
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      displayOrder: 0,
      dietaryType: "NA",
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

    if (result.error) {
      setServerError(result.error);
      setLoading(false);
      return;
    }
    router.push(`/shops/${shopId}/items`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start pb-10 font-[family-name:var(--font-jakarta)]">
      {/* Left column */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        {/* Basic info card */}
        <Card title="General Information">
          <FormField label="Item Name" required error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="e.g. Gulab Jamun"
              className="stitch-input"
            />
          </FormField>
          <FormField label="Description">
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe the item, ingredients, or features..."
              className="stitch-input resize-y h-auto py-2.5"
            />
          </FormField>
        </Card>

        {/* Pricing card */}
        <Card title="Pricing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Selling Price" required error={errors.price?.message}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">₹</span>
                <input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="stitch-input pl-8"
                />
              </div>
            </FormField>
            <FormField label="Original Price (optional)" hint="Shown struck-through to highlight a discount.">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">₹</span>
                <input
                  {...register("oldPrice")}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="stitch-input pl-8"
                />
              </div>
            </FormField>
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        {/* Media card */}
        <Card title="Item Media">
          <ImageUpload
            folder={`shops/${shopId}/items`}
            value={imageUrl}
            onChange={(url, pid) => {
              setImageUrl(url);
              setImagePublicId(pid);
              setValue("imageUrl", url);
              setValue("imagePublicId", pid);
            }}
            label="Upload Item Image"
            aspectHint="Square, 400×400px recommended"
          />
        </Card>

        {/* Organization card */}
        <Card title="Organization">
          <FormField label="Item Type">
            <div className="flex gap-4">
              <RadioOption {...register("itemType")} value="PRODUCT" label="PRODUCT" />
              <RadioOption {...register("itemType")} value="SERVICE" label="SERVICE" />
            </div>
          </FormField>

          <FormField label="Category">
            <select {...register("categoryId")} className="stitch-input cursor-pointer appearance-none">
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          {showDietary && (
            <FormField label="Dietary Type">
              <div className="grid grid-cols-2 gap-3">
                <DietaryRadio {...register("dietaryType")} value="VEG" label="Veg" dotColor="bg-secondary" />
                <DietaryRadio {...register("dietaryType")} value="NON_VEG" label="Non-veg" dotColor="bg-error" />
                <DietaryRadio {...register("dietaryType")} value="EGG" label="Egg" dotColor="bg-tertiary-fixed-dim" />
                <DietaryRadio {...register("dietaryType")} value="NA" label="N/A" dotColor="" />
              </div>
            </FormField>
          )}
        </Card>

        {/* Visibility card */}
        <Card title="Visibility">
          <ToggleRow
            register={register}
            name="isAvailable"
            label="Available for Sale"
            desc="Customer can purchase this item"
          />
          <hr className="border-outline-variant/40" />
          <ToggleRow
            register={register}
            name="isFeatured"
            label="Featured Item"
            desc="Show on storefront hero section"
          />
          <hr className="border-outline-variant/40" />
          <ToggleRow
            register={register}
            name="isBestseller"
            label="Bestseller Badge"
            desc="Highlight with a special tag"
          />
        </Card>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="xl:col-span-12 bg-error-container border border-error/20 rounded-lg p-3">
          <p className="text-on-error-container text-sm">{serverError}</p>
        </div>
      )}

      {/* Sticky-ish actions */}
      <div className="xl:col-span-12 flex flex-col sm:flex-row gap-3 justify-end font-[family-name:var(--font-inter)]">
        <button
          type="button"
          onClick={() => router.push(`/shops/${shopId}/items`)}
          className="px-6 py-3 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-on-primary text-sm font-medium rounded-lg shadow-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : itemId ? "Save Changes" : "Save Item"}
        </button>
      </div>

      <style jsx>{`
        :global(.stitch-input) {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--color-outline-variant);
          border-radius: 0.5rem;
          background-color: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          font-size: 16px;
          line-height: 1.5;
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
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-6">
      <h2 className="text-xl font-semibold text-on-surface mb-4">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-outline text-xs mt-1">{hint}</p>}
    </div>
  );
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const RadioOption = (props: RadioProps) => {
  const { label, ...rest } = props;
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        {...rest}
        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
      />
      <span className="text-base text-on-surface">{label}</span>
    </label>
  );
};

interface DietaryProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  dotColor: string;
}
const DietaryRadio = (props: DietaryProps) => {
  const { label, dotColor, ...rest } = props;
  return (
    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
      <input
        type="radio"
        {...rest}
        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
      />
      <span className="text-sm text-on-surface flex items-center gap-1.5">
        {dotColor && <span className={`w-3 h-3 rounded-full ${dotColor}`} />}
        {label}
      </span>
    </label>
  );
};

function ToggleRow({
  register,
  name,
  label,
  desc,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  name: string;
  label: string;
  desc: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <div className="flex flex-col">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
          {label}
        </span>
        <span className="text-xs text-outline">{desc}</span>
      </div>
      <div className="relative inline-flex items-center shrink-0">
        <input {...register(name)} type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </div>
    </label>
  );
}

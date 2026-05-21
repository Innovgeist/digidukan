"use client";
import { useState } from "react";
import { ArrowRight, ShoppingBag, Wrench, LayoutGrid, Check } from "lucide-react";
import { advanceOnboardingStep } from "@/lib/actions/shop";

interface Props {
  onNext: () => void;
}

const types = [
  {
    value: "RETAIL" as const,
    label: "Retail",
    desc: "Physical products — clothes, food, electronics",
    Icon: ShoppingBag,
  },
  {
    value: "SERVICE" as const,
    label: "Service",
    desc: "Services — salon, repair, consultation",
    Icon: Wrench,
  },
  {
    value: "MIXED" as const,
    label: "Mixed",
    desc: "Both products and services",
    Icon: LayoutGrid,
  },
];

export function Step2BusinessType({ onNext }: Props) {
  const [selected, setSelected] = useState<"RETAIL" | "SERVICE" | "MIXED">("MIXED");

  async function handleNext() {
    await advanceOnboardingStep(2);
    onNext();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          What type of business?
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          This helps us tailor your storefront and tools to fit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {types.map((t) => {
          const isSelected = selected === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setSelected(t.value)}
              className={`group relative flex items-center gap-4 p-4 bg-surface-container-lowest border-2 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isSelected
                  ? "border-primary shadow-stitch-2"
                  : "border-outline-variant hover:border-primary shadow-stitch-1"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-primary-container"
                    : "bg-surface-container group-hover:bg-primary-container/40"
                }`}
              >
                <t.Icon
                  className={`w-7 h-7 ${
                    isSelected ? "text-on-primary-container" : "text-surface-tint"
                  }`}
                  strokeWidth={2}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold text-base ${
                    isSelected ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {t.label}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant">
                  {t.desc}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-surface-variant flex justify-end">
        <button
          onClick={handleNext}
          className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm w-full sm:w-auto"
        >
          Continue
          <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

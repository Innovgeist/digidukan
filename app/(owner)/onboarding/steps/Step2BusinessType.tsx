"use client";
import { useState } from "react";
import { advanceOnboardingStep } from "@/lib/actions/shop";

interface Props { onNext: () => void }

const types = [
  { value: "RETAIL", label: "Retail", desc: "Physical products — clothes, food, electronics" },
  { value: "SERVICE", label: "Service", desc: "Services — salon, repair, consultation" },
  { value: "MIXED", label: "Mixed", desc: "Both products and services" },
] as const;

export function Step2BusinessType({ onNext }: Props) {
  const [selected, setSelected] = useState<"RETAIL" | "SERVICE" | "MIXED">("MIXED");

  async function handleNext() {
    await advanceOnboardingStep(2);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">What type of business?</h2>
      <p className="text-gray-500 text-sm mb-6">This helps us set up your storefront.</p>

      <div className="space-y-3 mb-6">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelected(t.value)}
            className={`w-full text-left rounded-xl border-2 p-4 transition-colors ${
              selected === t.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="font-medium text-gray-900">{t.label}</p>
            <p className="text-sm text-gray-500">{t.desc}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
      >
        Continue →
      </button>
    </div>
  );
}

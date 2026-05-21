"use client";
import { ArrowRight, User, Mail } from "lucide-react";
import { advanceOnboardingStep } from "@/lib/actions/shop";

interface Props {
  user: { name: string; email: string };
  onNext: () => void;
}

export function Step1Account({ user, onNext }: Props) {
  async function handleNext() {
    await advanceOnboardingStep(1);
    onNext();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">
          Basic Information
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Confirm the account that will manage your shops.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <ReadField icon={User} label="Full Name" value={user.name || "—"} />
        <ReadField icon={Mail} label="Email Address" value={user.email} />
      </div>

      <div className="pt-2 border-t border-surface-variant flex justify-end">
        <button
          onClick={handleNext}
          className="bg-primary text-on-primary font-[family-name:var(--font-inter)] text-sm font-medium h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm w-full sm:w-auto"
        >
          Looks good, continue
          <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

function ReadField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-outline" strokeWidth={2} />
        </span>
        <div className="w-full h-12 pl-10 pr-4 border border-outline-variant rounded-lg bg-surface-container-low text-on-surface flex items-center font-medium">
          {value}
        </div>
      </div>
    </div>
  );
}

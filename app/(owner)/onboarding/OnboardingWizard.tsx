"use client";

import { useState } from "react";
import { Step1Account } from "./steps/Step1Account";
import { Step2BusinessType } from "./steps/Step2BusinessType";
import { Step3CreateShop } from "./steps/Step3CreateShop";
import { Step4Branding } from "./steps/Step4Branding";
import { Step5Category } from "./steps/Step5Category";
import { Step6Items } from "./steps/Step6Items";
import { Step7Publish } from "./steps/Step7Publish";

interface Props {
  initialStep: number;
  user: { name: string; email: string };
  existingShop: { id: string; slug: string; name: string } | null;
}

export function OnboardingWizard({ initialStep, user, existingShop }: Props) {
  const [step, setStep] = useState(initialStep);
  const [shopId, setShopId] = useState<string | null>(existingShop?.id ?? null);
  const [shopSlug, setShopSlug] = useState<string | null>(existingShop?.slug ?? null);

  const next = (s?: number) => setStep((prev) => s ?? prev + 1);

  const props = { onNext: next, shopId, shopSlug };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {step === 0 && <Step1Account user={user} onNext={() => next(1)} />}
      {step === 1 && <Step2BusinessType onNext={() => next(2)} />}
      {step === 2 && (
        <Step3CreateShop
          onNext={(id, slug) => {
            setShopId(id);
            setShopSlug(slug);
            next(3);
          }}
        />
      )}
      {step === 3 && <Step4Branding {...props} />}
      {step === 4 && <Step5Category {...props} />}
      {step === 5 && <Step6Items {...props} />}
      {step === 6 && <Step7Publish shopId={shopId} shopSlug={shopSlug} />}
    </div>
  );
}

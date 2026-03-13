"use client";
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
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Confirm your account</h2>
      <p className="text-gray-500 text-sm mb-6">Make sure your details look correct.</p>

      <div className="space-y-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-0.5">Name</p>
          <p className="font-medium text-gray-900">{user.name || "—"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-0.5">Email</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
      >
        Looks good, continue →
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSignupCodeAction } from "@/lib/actions/admin-settings";

export function SignupCodeForm({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const dirty = value.trim() !== initialValue;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty) return;
    setLoading(true);
    const result = await updateSignupCodeAction(value);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Signup code updated.");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="signup-code"
          className="block text-sm font-medium text-on-surface mb-1.5 font-[family-name:var(--font-inter)]"
        >
          Current signup code
        </label>
        <input
          id="signup-code"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          minLength={4}
          maxLength={64}
        />
        <p className="text-xs text-on-surface-variant mt-1.5 font-[family-name:var(--font-inter)]">
          New owners must enter this code on the signup page. Share it only with
          partners you want onboarded.
        </p>
      </div>
      <button
        type="submit"
        disabled={loading || !dirty}
        className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-[family-name:var(--font-inter)] text-sm font-medium hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving…" : dirty ? "Save signup code" : "Saved"}
      </button>
    </form>
  );
}

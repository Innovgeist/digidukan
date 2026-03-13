"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";

interface ImpersonationBannerWrapperProps {
  targetName: string;
}

export function ImpersonationBannerWrapper({
  targetName,
}: ImpersonationBannerWrapperProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (dismissed) return null;

  async function handleEndSession() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/impersonation/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = (await response.json()) as { success?: boolean; redirectTo?: string };
        const redirectTo = data.redirectTo ?? "/admin";
        setDismissed(true);
        router.push(redirectTo);
      } else {
        // Even on error, attempt to go back to admin
        console.error("[ImpersonationBannerWrapper] Failed to end session");
        setDismissed(true);
        router.push("/admin");
      }
    } catch (err) {
      console.error("[ImpersonationBannerWrapper] Network error:", err);
      setDismissed(true);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImpersonationBanner
      targetName={loading ? "Ending session…" : targetName}
      onEnd={handleEndSession}
    />
  );
}

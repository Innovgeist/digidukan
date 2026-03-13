"use client";

import { useEffect } from "react";

export function StorefrontAnalytics({
  slug,
  isQrScan,
}: {
  slug: string;
  isQrScan: boolean;
}) {
  useEffect(() => {
    // Fire PAGE_VIEW
    fetch(`/api/public/shop/${slug}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "PAGE_VIEW" }),
    }).catch(() => {});

    // Fire QR_SCAN if ref=qr
    if (isQrScan) {
      fetch(`/api/public/shop/${slug}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "QR_SCAN" }),
      }).catch(() => {});
    }
  }, [slug, isQrScan]);

  return null;
}

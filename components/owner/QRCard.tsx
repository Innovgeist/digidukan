"use client";
import type { CardScale } from "@/lib/qr-studio-presets";

interface Props {
  qrUrl: string;
  topText: string;
  shopName: string;
  brandingText: string;
  scale: CardScale;
  className?: string;
}

export function QRCard({ qrUrl, topText, shopName, brandingText, scale, className = "" }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-between border border-gray-200 bg-white w-full overflow-hidden ${scale.paddingClass} ${className}`}
    >
      {/* Top: text above QR */}
      <div className="shrink-0 text-center w-full">
        <p className={`text-gray-500 font-medium tracking-widest uppercase ${scale.topTextClass}`}>
          {topText}
        </p>
        <p className={`text-gray-900 font-bold ${scale.shopNameClass} mt-1`}>
          {shopName}
        </p>
      </div>

      {/* Middle: QR fills remaining height */}
      <div className="flex-1 flex items-center justify-center w-full py-1" style={{ minHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt="QR Code"
          style={{ height: "100%", width: "auto", maxWidth: "90%", objectFit: "contain" }}
        />
      </div>

      {/* Bottom: branding */}
      <p className={`shrink-0 text-gray-400 text-center ${scale.brandingClass}`}>
        {brandingText}
      </p>
    </div>
  );
}

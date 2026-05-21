"use client";

import { useState } from "react";
import { Phone, Share2, MapPin, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface Props {
  phone?: string | null;
  whatsappNumber?: string | null;
  mapsUrl?: string | null;
  shopSlug: string;
}

function trackEvent(shopSlug: string, event: string) {
  fetch(`/api/public/shop/${shopSlug}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  }).catch(() => {});
}

interface TileProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

function Tile({ label, icon, href, onClick, external }: TileProps) {
  const inner = (
    <>
      <span className="w-10 h-10 flex items-center justify-center text-[var(--color-heritage-brass-deep)]">
        {icon}
      </span>
      <span className="heritage-label text-[10px] text-[var(--color-heritage-emerald)]">
        {label}
      </span>
    </>
  );
  const className =
    "relative cartouche-frame flex-1 min-w-[88px] bg-[var(--color-heritage-ivory)] flex flex-col items-center justify-center gap-1 py-3 transition-transform active:scale-[0.97]";
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export function ActionsPremium({
  phone,
  whatsappNumber,
  mapsUrl,
  shopSlug,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
    trackEvent(shopSlug, "SHARE_CLICK");
  };

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20offerings`
    : null;

  return (
    <div className="max-w-lg mx-auto px-5 pb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {phone && (
          <Tile
            label="Call"
            icon={<Phone className="w-[18px] h-[18px]" strokeWidth={1.6} />}
            href={`tel:${phone}`}
            onClick={() => trackEvent(shopSlug, "CALL_CLICK")}
          />
        )}
        {waHref && (
          <Tile
            label="WhatsApp"
            icon={<WhatsAppIcon className="w-[18px] h-[18px]" />}
            href={waHref}
            external
            onClick={() => trackEvent(shopSlug, "WHATSAPP_CLICK")}
          />
        )}
        {mapsUrl && (
          <Tile
            label="Directions"
            icon={<MapPin className="w-[18px] h-[18px]" strokeWidth={1.6} />}
            href={mapsUrl}
            external
            onClick={() => trackEvent(shopSlug, "MAP_CLICK")}
          />
        )}
        <Tile
          label={copied ? "Copied" : "Share"}
          icon={
            copied ? (
              <Check className="w-[18px] h-[18px]" strokeWidth={2} />
            ) : (
              <Share2 className="w-[18px] h-[18px]" strokeWidth={1.6} />
            )
          }
          onClick={handleShare}
        />
      </div>
    </div>
  );
}

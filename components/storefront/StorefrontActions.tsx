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

interface ActionTileProps {
  label: string;
  icon: React.ReactNode;
  tone: "leaf" | "saffron" | "mango" | "ink";
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

const TONE_CLASSES: Record<ActionTileProps["tone"], { bg: string; ring: string; iconBg: string; iconText: string }> = {
  leaf:    { bg: "bg-paper-2", ring: "border-leaf/25 hover:border-leaf/50", iconBg: "bg-leaf-soft", iconText: "text-leaf" },
  saffron: { bg: "bg-paper-2", ring: "border-saffron/25 hover:border-saffron/50", iconBg: "bg-saffron-soft", iconText: "text-saffron" },
  mango:   { bg: "bg-paper-2", ring: "border-mango/25 hover:border-mango/50", iconBg: "bg-mango-soft", iconText: "text-mango-deep" },
  ink:     { bg: "bg-paper-2", ring: "border-ink-line-strong hover:border-ink/40", iconBg: "bg-paper-3", iconText: "text-ink-2" },
};

function ActionTile({ label, icon, tone, href, onClick, external }: ActionTileProps) {
  const c = TONE_CLASSES[tone];
  const inner = (
    <>
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg} ${c.iconText}`}>
        {icon}
      </span>
      <span className="font-medium text-[15px] text-ink truncate">{label}</span>
    </>
  );
  const className = `press-soft flex-1 min-w-[140px] flex items-center gap-2.5 px-3 h-14 rounded-2xl border-2 ${c.bg} ${c.ring} shadow-[0_2px_0_rgba(31,24,18,0.06)] transition-colors`;
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
    <button onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export function StorefrontActions({
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
        // clipboard not available
      }
    }
    trackEvent(shopSlug, "SHARE_CLICK");
  };

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=Hi%2C%20I%20want%20to%20enquire%20about%20your%20shop`
    : null;

  return (
    <div className="max-w-lg mx-auto px-5 pt-1 pb-4">
      <div className="flex flex-wrap gap-2.5">
        {phone && (
          <ActionTile
            label="Call shop"
            tone="leaf"
            icon={<Phone className="w-4 h-4" strokeWidth={2.2} />}
            href={`tel:${phone}`}
            onClick={() => trackEvent(shopSlug, "CALL_CLICK")}
          />
        )}
        {waHref && (
          <ActionTile
            label="WhatsApp"
            tone="leaf"
            icon={<WhatsAppIcon className="w-[18px] h-[18px]" />}
            href={waHref}
            external
            onClick={() => trackEvent(shopSlug, "WHATSAPP_CLICK")}
          />
        )}
        {mapsUrl && (
          <ActionTile
            label="Directions"
            tone="saffron"
            icon={<MapPin className="w-4 h-4" strokeWidth={2.2} />}
            href={mapsUrl}
            external
            onClick={() => trackEvent(shopSlug, "MAP_CLICK")}
          />
        )}
        <ActionTile
          label={copied ? "Link copied" : "Share shop"}
          tone="mango"
          icon={copied ? <Check className="w-4 h-4" strokeWidth={2.4} /> : <Share2 className="w-4 h-4" strokeWidth={2.2} />}
          onClick={handleShare}
        />
      </div>
    </div>
  );
}

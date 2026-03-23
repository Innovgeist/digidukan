"use client";

import { useState } from "react";
import { Phone, MessageCircle, Share2, MapPin, Check } from "lucide-react";

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
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard not available
      }
    }
    trackEvent(shopSlug, "SHARE_CLICK");
  };

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=Hi%2C%20I%20want%20to%20enquire%20about%20your%20shop`
    : null;

  return (
    <div className="max-w-lg mx-auto px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={() => trackEvent(shopSlug, "CALL_CLICK")}
            className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm rounded-full shadow-sm whitespace-nowrap flex-shrink-0 text-green-700 hover:bg-green-50 transition-colors font-medium"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        )}

        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(shopSlug, "WHATSAPP_CLICK")}
            className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm rounded-full shadow-sm whitespace-nowrap flex-shrink-0 text-green-600 hover:bg-green-50 transition-colors font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm rounded-full shadow-sm whitespace-nowrap flex-shrink-0 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Copied!" : "Share"}
        </button>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(shopSlug, "MAP_CLICK")}
            className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm rounded-full shadow-sm whitespace-nowrap flex-shrink-0 text-orange-600 hover:bg-orange-50 transition-colors font-medium"
          >
            <MapPin className="w-4 h-4" />
            Directions
          </a>
        )}
      </div>
    </div>
  );
}

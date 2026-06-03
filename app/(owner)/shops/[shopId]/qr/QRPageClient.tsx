"use client";
import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, Palette, Download } from "lucide-react";
import { QRStudio } from "@/components/owner/QRStudio";

interface Props {
  shopId: string;
  shopName: string;
  shopSlug: string;
  qrUrl: string;
  targetUrl: string;
  isPublished: boolean;
}

export function QRPageClient({ shopId, shopName, shopSlug: _shopSlug, qrUrl, targetUrl, isPublished }: Props) {
  const [currentQrUrl, setCurrentQrUrl] = useState(qrUrl);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  function downloadQR() {
    const link = document.createElement("a");
    link.href = currentQrUrl;
    link.download = `${shopName.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.click();
  }

  function downloadPoster() {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #qr-poster, #qr-poster * { visibility: visible !important; }
        #qr-poster {
          position: fixed !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 20mm !important;
          box-sizing: border-box !important;
          border: none !important;
          border-radius: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          background: white !important;
          transform: none !important;
        }
        #qr-poster img {
          width: 180mm !important;
          height: 180mm !important;
          object-fit: contain !important;
        }
        #qr-poster p {
          font-size: 18pt !important;
          margin: 4mm 0 !important;
        }
        @page { size: A4 portrait; margin: 0; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  }

  async function handleRegenerate() {
    if (!confirm("Regenerate QR code? The old QR code will no longer work.")) return;
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/owner/shops/${shopId}/qr/regenerate`, { method: "POST" });
      const data = await res.json();
      if (data.qrUrl) {
        setCurrentQrUrl(data.qrUrl);
      } else {
        setError(data.error ?? "Regeneration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setRegenerating(false);
  }

  return (
    <>
    <div className="space-y-6">
      {!isPublished && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-amber-800 text-sm">
            Your shop is not published yet. The QR code will work once you publish the shop.
          </p>
        </div>
      )}

      {/* QR Preview card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <div className="inline-block p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
          <Image
            src={currentQrUrl}
            alt="QR Code"
            width={220}
            height={220}
            className="rounded"
            unoptimized={currentQrUrl.startsWith("data:")}
          />
        </div>
        <p className="text-xs text-gray-500 mb-1">Scans to:</p>
        <p className="text-sm font-mono text-blue-600 break-all">{targetUrl}?ref=qr</p>
      </div>

      {/* QR Poster preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">QR Poster</h2>
        {/* Poster layout for screenshot/print */}
        <div id="qr-poster" className="border border-gray-200 rounded-xl p-6 text-center max-w-xs mx-auto bg-white">
          <p className="text-lg font-bold text-gray-900 mb-1">{shopName}</p>
          <p className="text-xs text-gray-500 mb-4">Scan to view our catalog</p>
          <div className="inline-block p-2 border border-gray-200 rounded-lg">
            <Image
              src={currentQrUrl}
              alt="QR Code"
              width={160}
              height={160}
              unoptimized={currentQrUrl.startsWith("data:")}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">Powered by DigiDukan</p>
          <p className="text-xs text-gray-400 mt-1">Created by Innovgeist</p>
        </div>
        <button
          onClick={downloadPoster}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download Poster (PDF)
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setIsStudioOpen(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Palette className="w-4 h-4" />
          Open QR Studio (Print / Layout)
        </button>
        <button
          onClick={downloadQR}
          className="w-full border border-blue-200 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
        >
          ⬇ Download Raw QR (PNG)
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
        >
          {regenerating ? "Regenerating..." : "🔄 Regenerate QR Code"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          Regenerate only if your shop URL (slug) has changed. Old QR codes will stop working.
        </p>
      </div>
    </div>

      {isStudioOpen && (
        <QRStudio
          shopName={shopName}
          qrUrl={currentQrUrl}
          onClose={() => setIsStudioOpen(false)}
        />
      )}
    </>
  );
}

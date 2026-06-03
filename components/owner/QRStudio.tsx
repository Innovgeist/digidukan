"use client";
import { useState } from "react";
import { X, Printer } from "lucide-react";
import { QRCard } from "./QRCard";
import {
  LAYOUT_PRESETS,
  CARD_SCALE,
  type LayoutPresetId,
  type LayoutPreset,
  type CardSize,
} from "@/lib/qr-studio-presets";

interface Props {
  shopName: string;
  qrUrl: string;
  onClose: () => void;
}

const A4_W = 794;
const A4_H = 1123;
const SCALE = 0.52;

interface A4PreviewProps {
  preset: LayoutPreset;
  qrUrl: string;
  topText: string;
  shopName: string;
  brandingText: string;
}

function A4Preview({ preset, qrUrl, topText, shopName, brandingText }: A4PreviewProps) {
  const baseStyle: React.CSSProperties = {
    width: A4_W,
    height: A4_H,
    transform: `scale(${SCALE})`,
    transformOrigin: "top left",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "white",
    padding: "16px",
    boxSizing: "border-box",
  };

  const colCount = preset.id === "1-large" ? 1 : 2;
  const rowCount = Math.ceil(preset.cards.length / colCount);

  function renderCard(size: CardSize, index: number) {
    return (
      <QRCard
        key={index}
        qrUrl={qrUrl}
        topText={topText}
        shopName={shopName}
        brandingText={brandingText}
        scale={CARD_SCALE[size]}
        className="h-full"
      />
    );
  }

  return (
    <div
      style={{ width: A4_W * SCALE, height: A4_H * SCALE }}
      className="relative shadow-2xl"
    >
      <div
        id="qr-print-sheet"
        style={{
          ...baseStyle,
          display: "grid",
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
          gap: 8,
        }}
      >
        {preset.cards.map((size, i) => renderCard(size, i))}
      </div>
    </div>
  );
}

export function QRStudio({ shopName, qrUrl, onClose }: Props) {
  const [topText, setTopText] = useState("Scan to Order");
  const [shopNameText, setShopNameText] = useState(shopName);
  const [brandingText, setBrandingText] = useState("Created by Innovgeist");
  const [presetId, setPresetId] = useState<LayoutPresetId>("1-large");

  const preset = LAYOUT_PRESETS.find((p) => p.id === presetId)!;

  return (
    <>
      {/* Print CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #qr-print-sheet,
          #qr-print-sheet * { visibility: visible !important; }
          #qr-print-sheet {
            position: fixed !important;
            inset: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 8mm !important;
            box-sizing: border-box !important;
            background: white !important;
            transform: none !important;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      <div
        id="qr-studio-root"
        className="fixed inset-0 bg-black/70 flex"
        style={{ zIndex: 60 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Left config panel */}
        <aside className="w-72 bg-white h-full overflow-y-auto flex flex-col border-r border-gray-200 shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">QR Studio</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close studio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-6 p-5 flex-1">
            {/* Text config */}
            <section>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Card Text
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Top text</label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Shop name</label>
                  <input
                    type="text"
                    value={shopNameText}
                    onChange={(e) => setShopNameText(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Branding line</label>
                  <input
                    type="text"
                    value={brandingText}
                    onChange={(e) => setBrandingText(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Layout presets */}
            <section>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Layout
              </p>
              <div className="flex flex-col gap-2">
                {LAYOUT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPresetId(p.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                      presetId === p.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-sm font-medium">{p.label}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{p.description}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Print button pinned to bottom */}
          <div className="p-5 border-t border-gray-200">
            <button
              onClick={() => window.print()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Use &quot;Save as PDF&quot; in the print dialog
            </p>
          </div>
        </aside>

        {/* Right preview panel */}
        <main className="flex-1 overflow-auto bg-gray-300 flex items-start justify-center p-10">
          <A4Preview
            preset={preset}
            qrUrl={qrUrl}
            topText={topText}
            shopName={shopNameText}
            brandingText={brandingText}
          />
        </main>
      </div>
    </>
  );
}

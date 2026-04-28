"use client";
import { useCart } from "@/lib/cart";
import { generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag, NotebookPen, Send } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getCategoryIcon } from "@/lib/category-icon";

interface Props {
  open: boolean;
  onClose: () => void;
  primaryColor: string;
}

export function CartDrawer({ open, onClose, primaryColor }: Props) {
  const {
    items,
    shopName,
    whatsappNumber,
    customerNote,
    setNote,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    itemCount,
  } = useCart();

  function handleWhatsAppOrder() {
    if (!whatsappNumber || items.length === 0) return;
    const message = generateWhatsAppMessage(shopName, items, total, customerNote);
    const url = getWhatsAppUrl(whatsappNumber, message);

    fetch(`/api/public/shop/${encodeURIComponent(window.location.pathname.split("/s/")[1]?.split("/")[0] ?? "")}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "WHATSAPP_CLICK" }),
    }).catch(() => {});

    window.open(url, "_blank", "noopener noreferrer");
    clearCart();
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-ink/60 z-50 animate-fade-in" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-paper rounded-t-[28px] max-h-[88vh] flex flex-col max-w-lg mx-auto shadow-[0_-12px_40px_rgba(31,24,18,0.25)] animate-slide-up overflow-hidden">
        {/* Grip */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-ink-line-strong rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ink-line shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-medium">
              Your basket
            </p>
            <h2 className="font-display font-semibold text-[22px] text-ink leading-tight tracking-tight">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="press-soft w-10 h-10 rounded-full bg-paper-3 border border-ink-line flex items-center justify-center text-ink-2 hover:text-ink"
            aria-label="Close cart"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-paper-3 flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6 text-ink-3" strokeWidth={1.8} />
              </div>
              <p className="font-display text-[17px] font-semibold text-ink mb-1">
                Your basket is empty
              </p>
              <p className="text-[13px] text-ink-3">
                Add a few things from the menu to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-3.5">
              {items.map((item) => {
                const FallbackIcon = getCategoryIcon(item.name);
                return (
                  <li
                    key={item.itemId}
                    className="flex items-center gap-3 bg-paper-2 border border-ink-line rounded-2xl p-2.5"
                  >
                    <div className="w-14 h-14 rounded-xl bg-paper-3 shrink-0 relative overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      ) : (
                        <span style={{ color: primaryColor }}>
                          <FallbackIcon className="w-6 h-6" strokeWidth={1.6} />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-[14.5px] text-ink truncate leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[12px] text-ink-3 mt-0.5 tabular">
                        ₹{item.price.toLocaleString("en-IN")}
                        <span className="text-ink-line-strong"> · </span>
                        <span className="text-ink-2 font-medium">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        className="press-soft w-10 h-10 rounded-lg bg-paper border border-ink-line flex items-center justify-center text-ink-2"
                        aria-label="Decrease"
                      >
                        <Minus className="w-4 h-4" strokeWidth={2.4} />
                      </button>
                      <span className="w-7 text-center font-display font-bold text-[15px] text-ink tabular">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        className="press-soft w-10 h-10 rounded-lg flex items-center justify-center text-paper"
                        style={{ backgroundColor: primaryColor }}
                        aria-label="Increase"
                      >
                        <Plus className="w-4 h-4" strokeWidth={2.4} />
                      </button>
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="press-soft ml-1 w-10 h-10 rounded-lg flex items-center justify-center text-brick/70 hover:text-brick hover:bg-brick-soft transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2.2} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-5">
              <div className="rule-line opacity-70 mb-3" />
              <label className="flex items-center gap-1.5 text-[12px] font-medium text-ink-2 mb-1.5">
                <NotebookPen className="w-3.5 h-3.5 text-ink-3" strokeWidth={2.2} />
                Add a note for the shop
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. No onions, less spicy, ring the bell on arrival…"
                className="w-full bg-paper-2 border-2 border-ink-line rounded-2xl px-3.5 py-3 text-[14px] text-ink placeholder-ink-3 focus:outline-none focus:border-ink-line-strong resize-none transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pt-3 pb-5 border-t border-ink-line shrink-0 bg-paper-2">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-medium">
                  Subtotal
                </p>
                <p className="font-display font-bold text-[26px] text-ink leading-none mt-1 tabular">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
              <p className="text-[11px] text-ink-3 max-w-[140px] text-right leading-snug">
                Pay directly to the shop after confirming on WhatsApp.
              </p>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              disabled={!whatsappNumber || items.length === 0}
              className="press-soft w-full h-14 rounded-2xl font-display font-semibold text-[16px] text-paper bg-leaf hover:bg-leaf/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2.5 shadow-[0_3px_0_rgba(31,24,18,0.18)]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Send order on WhatsApp
              <Send className="w-4 h-4 opacity-80" strokeWidth={2.4} />
            </button>

            {!whatsappNumber && (
              <p className="text-[12px] text-center text-brick mt-2">
                The shop hasn&apos;t set up WhatsApp yet — please call them instead.
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full h-10 mt-1.5 text-[13px] text-ink-3 hover:text-ink-2 transition-colors"
            >
              Continue browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}

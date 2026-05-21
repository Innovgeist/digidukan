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

export function CartDrawerPremium({ open, onClose, primaryColor }: Props) {
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
      <div className="fixed inset-0 bg-[var(--color-heritage-emerald)]/70 z-50 animate-fade-in" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-heritage-cream)] max-h-[90vh] flex flex-col max-w-lg mx-auto shadow-[0_-12px_40px_rgba(30,27,19,0.35)] animate-slide-up overflow-hidden">
        {/* Emerald header */}
        <div className="bg-[var(--color-heritage-emerald)] px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <p className="heritage-label text-[10px] text-[var(--color-heritage-brass)] mb-0.5">
              Your Order
            </p>
            <h2 className="font-[family-name:var(--font-heritage)] font-semibold italic text-[22px] text-[var(--color-heritage-ivory)] leading-tight">
              {itemCount} {itemCount === 1 ? "selection" : "selections"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 border border-[var(--color-heritage-brass)] text-[var(--color-heritage-ivory)] flex items-center justify-center hover:bg-[var(--color-heritage-emerald-2)] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="cartouche-frame inline-flex w-16 h-16 items-center justify-center mb-4 bg-[var(--color-heritage-ivory)]">
                <ShoppingBag className="w-6 h-6 text-[var(--color-heritage-brass-deep)]" strokeWidth={1.4} />
              </div>
              <p className="font-[family-name:var(--font-heritage)] font-semibold italic text-[18px] text-[var(--color-heritage-emerald)] mb-1">
                Your selection is empty.
              </p>
              <p className="font-[family-name:var(--font-inter)] text-[14px] text-[var(--color-heritage-ink-soft)]">
                Browse the catalogue to begin curating your order.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const FallbackIcon = getCategoryIcon(item.name);
                return (
                  <li
                    key={item.itemId}
                    className="flex items-center gap-3 bg-[var(--color-heritage-ivory)] border border-[var(--color-heritage-brass)]/40 p-2.5"
                  >
                    <div className="w-14 h-14 shrink-0 relative overflow-hidden bg-[var(--color-heritage-cream-soft)] flex items-center justify-center">
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
                        <FallbackIcon className="w-6 h-6 text-[var(--color-heritage-brass-deep)]" strokeWidth={1.4} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-[family-name:var(--font-heritage)] font-semibold text-[14px] text-[var(--color-heritage-emerald)] truncate uppercase"
                        style={{ letterSpacing: "0.03em" }}
                      >
                        {item.name}
                      </p>
                      <p className="font-[family-name:var(--font-inter)] text-[12px] text-[var(--color-heritage-ink-soft)] mt-0.5 tabular">
                        ₹{item.price.toLocaleString("en-IN")}
                        <span className="text-[var(--color-heritage-brass)]"> · </span>
                        <span className="text-[var(--color-heritage-maroon-deep)] font-medium">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        className="w-9 h-9 border border-[var(--color-heritage-emerald)] flex items-center justify-center text-[var(--color-heritage-emerald)] hover:bg-[var(--color-heritage-cream-soft)] transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <span className="w-7 text-center font-[family-name:var(--font-inter)] font-semibold text-[14px] text-[var(--color-heritage-emerald)] tabular">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-heritage-ivory)]"
                        style={{ backgroundColor: primaryColor }}
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.itemId)}
                        className="ml-1 w-9 h-9 flex items-center justify-center text-[var(--color-heritage-maroon)]/70 hover:text-[var(--color-heritage-maroon-deep)] hover:bg-[var(--color-heritage-maroon-soft)] transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6">
              <div className="brass-divider brass-divider-on-ivory my-5" aria-hidden />
              <label className="flex items-center gap-2 heritage-label text-[10px] text-[var(--color-heritage-emerald)] mb-2">
                <NotebookPen className="w-3.5 h-3.5" strokeWidth={1.8} />
                Note for the establishment
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Any preferences or instructions for your order…"
                className="w-full bg-[var(--color-heritage-ivory)] border border-[var(--color-heritage-emerald)] px-3.5 py-3 font-[family-name:var(--font-inter)] text-[14px] text-[var(--color-heritage-ink)] placeholder-[var(--color-heritage-ink-mute)] focus:outline-none focus:ring-1 focus:ring-[var(--color-heritage-emerald)] resize-none transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pt-4 pb-6 border-t border-[var(--color-heritage-brass)]/40 shrink-0 bg-[var(--color-heritage-cream-soft)]">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="heritage-label text-[10px] text-[var(--color-heritage-brass-deep)] mb-1">
                  Subtotal
                </p>
                <p className="font-[family-name:var(--font-heritage)] italic font-semibold text-[28px] text-[var(--color-heritage-maroon-deep)] leading-none tabular">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
              <p className="font-[family-name:var(--font-inter)] text-[11px] text-[var(--color-heritage-ink-soft)] max-w-[150px] text-right leading-snug">
                Settlement is made directly with the establishment after confirmation.
              </p>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={!whatsappNumber || items.length === 0}
              className="w-full h-14 bg-[var(--color-heritage-maroon)] text-[var(--color-heritage-ivory)] heritage-label text-[12px] flex items-center justify-center gap-3 hover:bg-[var(--color-heritage-maroon-deep)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Confirm via WhatsApp
              <Send className="w-3.5 h-3.5 opacity-80" strokeWidth={1.8} />
            </button>

            {!whatsappNumber && (
              <p className="font-[family-name:var(--font-inter)] text-[12px] text-center text-[var(--color-heritage-maroon-deep)] mt-2">
                The establishment has not enabled WhatsApp — please telephone instead.
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 mt-2 font-[family-name:var(--font-inter)] text-[12px] text-[var(--color-heritage-ink-soft)] hover:text-[var(--color-heritage-ink)] transition-colors"
            >
              Continue browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}

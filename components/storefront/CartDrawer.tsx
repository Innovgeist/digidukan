"use client";
import { useCart } from "@/lib/cart";
import { generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import { X, Minus, Plus, Trash2, MessageCircle, ShoppingCart, Send } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  primaryColor: string;
}

export function CartDrawer({ open, onClose, primaryColor }: Props) {
  const { items, shopName, whatsappNumber, customerNote, setNote, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();

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
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] flex flex-col max-w-lg mx-auto shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900 text-lg">Your Cart ({itemCount})</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.itemId} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 relative overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.itemId)}
                    className="ml-1 w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                <MessageCircle className="w-3 h-3" />
                Add a note (optional)
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. No onions, extra spicy..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 resize-none"
                style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal ({itemCount} items)</span>
              <span className="font-bold text-lg text-gray-900">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              disabled={!whatsappNumber || items.length === 0}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Order on WhatsApp
            </button>

            {!whatsappNumber && (
              <p className="text-xs text-center text-gray-400">WhatsApp not configured for this shop</p>
            )}

            <button onClick={onClose} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

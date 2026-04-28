"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { ShoppingBag, ChevronUp } from "lucide-react";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export function CartFloatingButton({ primaryColor }: { primaryColor: string }) {
  const { itemCount, total } = useCart();
  const [open, setOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 inset-x-4 z-40 max-w-lg mx-auto reveal-up">
        <button
          onClick={() => setOpen(true)}
          className="press-soft w-full h-14 pl-2 pr-5 rounded-2xl bg-ink text-paper flex items-center gap-3 shadow-[0_8px_24px_rgba(31,24,18,0.35)]"
        >
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative"
            style={{ backgroundColor: primaryColor }}
          >
            <ShoppingBag className="w-[18px] h-[18px] text-paper" strokeWidth={2.2} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-mango text-ink text-[10px] font-bold flex items-center justify-center shadow-sm tabular">
              {itemCount}
            </span>
          </span>

          <span className="flex-1 text-left">
            <span className="block text-[11px] uppercase tracking-[0.14em] text-paper/60 leading-none">
              Your basket
            </span>
            <span className="block font-display font-semibold text-[17px] tabular leading-tight mt-0.5">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </span>

          <span className="flex items-center gap-1.5 text-[13px] font-medium text-paper/80">
            View
            <ChevronUp className="w-4 h-4" strokeWidth={2.4} />
          </span>
        </button>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} primaryColor={primaryColor} />
    </>
  );
}

"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { ShoppingBag } from "lucide-react";
import { CartDrawerPremium } from "@/components/storefront/premium/CartDrawerPremium";

export function CartFloatingButtonPremium({ primaryColor }: { primaryColor: string }) {
  const { itemCount, total } = useCart();
  const [open, setOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 inset-x-4 z-40 max-w-lg mx-auto heritage-fade-up">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full h-14 px-4 bg-[var(--color-heritage-emerald)] text-[var(--color-heritage-ivory)] border border-[var(--color-heritage-brass)] flex items-center gap-3 shadow-[0_12px_28px_rgba(30,27,19,0.35)] transition-transform active:scale-[0.99]"
        >
          <span
            className="w-9 h-9 flex items-center justify-center relative"
            style={{ backgroundColor: primaryColor }}
          >
            <ShoppingBag className="w-[18px] h-[18px] text-[var(--color-heritage-ivory)]" strokeWidth={1.6} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--color-heritage-brass)] text-[var(--color-heritage-emerald)] text-[10px] font-bold flex items-center justify-center tabular font-[family-name:var(--font-inter)]">
              {itemCount}
            </span>
          </span>

          <span className="flex-1 text-left">
            <span className="heritage-label text-[9px] text-[var(--color-heritage-brass)] leading-none">
              Your Order
            </span>
            <span className="block font-[family-name:var(--font-heritage)] italic font-semibold text-[18px] tabular leading-tight mt-0.5">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </span>

          <span className="heritage-label text-[10px] text-[var(--color-heritage-brass)]">
            View
          </span>
        </button>
      </div>
      <CartDrawerPremium open={open} onClose={() => setOpen(false)} primaryColor={primaryColor} />
    </>
  );
}

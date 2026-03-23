"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export function CartFloatingButton({ primaryColor }: { primaryColor: string }) {
  const { itemCount, total } = useCart();
  const [open, setOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-full text-white font-semibold text-sm max-w-xs w-full justify-between transition-transform active:scale-95"
        style={{ backgroundColor: primaryColor, boxShadow: `0 4px 20px ${primaryColor}60` }}
      >
        <span className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} primaryColor={primaryColor} />
    </>
  );
}

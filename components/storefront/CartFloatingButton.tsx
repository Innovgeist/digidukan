"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export function CartFloatingButton({ primaryColor }: { primaryColor: string }) {
  const { itemCount, total } = useCart();
  const [open, setOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg text-white font-semibold text-sm max-w-xs w-full justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <span>🛒 {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} primaryColor={primaryColor} />
    </>
  );
}

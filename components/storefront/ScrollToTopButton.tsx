"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useCart } from "@/lib/cart";

export function ScrollToTopButton() {
  const { itemCount } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`press-soft fixed right-4 z-30 w-11 h-11 rounded-full bg-paper-2 border border-ink-line text-ink-2 flex items-center justify-center shadow-[0_4px_12px_rgba(31,24,18,0.18)] hover:text-ink transition-all ${
        itemCount > 0 ? "bottom-24" : "bottom-6"
      }`}
    >
      <ArrowUp className="w-5 h-5" strokeWidth={2.2} />
    </button>
  );
}

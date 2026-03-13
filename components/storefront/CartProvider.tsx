"use client";
import { useState, useEffect, useCallback } from "react";
import { CartContext, type CartItem } from "@/lib/cart";

interface Props {
  children: React.ReactNode;
  shopId: string;
  shopName: string;
  whatsappNumber: string;
}

export function CartProvider({ children, shopId, shopName, whatsappNumber }: Props) {
  const storageKey = `cart_${shopId}`;

  const [items, setItems] = useState<CartItem[]>([]);
  const [customerNote, setCustomerNoteState] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed.items ?? []);
        setCustomerNoteState(parsed.note ?? "");
      }
    } catch {}
  }, [storageKey]);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ items, note: customerNote }));
    } catch {}
  }, [items, customerNote, storageKey]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === newItem.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === newItem.itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.itemId !== itemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.itemId === itemId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomerNoteState("");
    try { localStorage.removeItem(storageKey); } catch {}
  }, [storageKey]);

  const setNote = useCallback((note: string) => {
    setCustomerNoteState(note);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        shopId,
        shopName,
        whatsappNumber,
        items,
        customerNote,
        addItem,
        removeItem,
        updateQuantity,
        setNote,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

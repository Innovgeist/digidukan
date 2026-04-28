"use client";

import { ItemCard } from "@/components/storefront/ItemCard";
import { SearchX } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  dietaryType: string;
  categoryName: string;
}

interface Props {
  items: Item[];
  primaryColor?: string;
}

export function ItemGrid({ items, primaryColor = "#D9622E" }: Props) {
  if (items.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-paper-3 border border-ink-line flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6 text-ink-3" strokeWidth={1.8} />
        </div>
        <p className="font-display text-[18px] font-semibold text-ink mb-1">
          Nothing matches that search
        </p>
        <p className="text-[14px] text-ink-3">
          Try a different word or clear the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 pb-6">
      <div className="grid grid-cols-2 gap-3.5">
        {items.map((item) => (
          <ItemCard key={item.id} {...item} primaryColor={primaryColor} />
        ))}
      </div>
    </div>
  );
}

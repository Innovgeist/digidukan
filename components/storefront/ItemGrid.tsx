"use client";

import { ItemCard } from "@/components/storefront/ItemCard";
import { Search } from "lucide-react";

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

export function ItemGrid({ items, primaryColor = "#3B82F6" }: Props) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No items found.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <ItemCard key={item.id} {...item} primaryColor={primaryColor} />
        ))}
      </div>
    </div>
  );
}

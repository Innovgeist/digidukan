"use client";

import { ItemCard } from "@/components/storefront/ItemCard";

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
      <div className="px-4 py-12 text-center">
        <p className="text-4xl mb-3">🔍</p>
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

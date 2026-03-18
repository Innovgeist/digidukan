"use client";

import { useState } from "react";
import { CollectionChips } from "@/components/storefront/CollectionChips";
import { FeaturedSection } from "@/components/storefront/FeaturedSection";
import { ItemGrid } from "@/components/storefront/ItemGrid";
import { CartProvider } from "@/components/storefront/CartProvider";
import { CartFloatingButton } from "@/components/storefront/CartFloatingButton";

export interface Item {
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
  categoryId: string | null;
  categoryName: string;
}

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  coverUrl?: string | null;
  type: string;
  itemIds: string[];
}

interface Props {
  items: Item[];
  categories: Category[];
  collections: Collection[];
  primaryColor: string;
  shopId: string;
  shopName: string;
  whatsappNumber?: string | null;
}

export function StorefrontClient({
  items,
  categories,
  collections,
  primaryColor,
  shopId,
  shopName,
  whatsappNumber,
}: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // All items come in as a flat list — no risk of missing uncategorized items.
  const allItems = items;

  const filteredItems = allItems.filter((item) => {
    // Collection filter
    if (selectedCollectionId) {
      const col = collections.find((c) => c.id === selectedCollectionId);
      if (col && !col.itemIds.includes(item.id)) return false;
    }
    // Category filter — match by categoryId, not by scanning nested arrays
    if (selectedCategoryId) {
      if (item.categoryId !== selectedCategoryId) return false;
    }
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const featuredItems = allItems.filter((i) => i.isFeatured && i.isAvailable);

  const showFeatured =
    !selectedCollectionId &&
    !selectedCategoryId &&
    searchQuery.trim() === "" &&
    featuredItems.length > 0;

  const handleCollectionSelect = (id: string | null) => {
    setSelectedCollectionId(id);
    setSelectedCategoryId(null); // clear category when collection changes
  };

  const handleCategorySelect = (id: string | null) => {
    setSelectedCategoryId(id);
    setSelectedCollectionId(null); // clear collection when category changes
  };

  return (
    <CartProvider shopId={shopId} shopName={shopName} whatsappNumber={whatsappNumber ?? ""}>
      <div className="max-w-lg mx-auto">
        {/* Collection chips */}
        {collections.length > 0 && (
          <CollectionChips
            collections={collections}
            selected={selectedCollectionId}
            onSelect={handleCollectionSelect}
            primaryColor={primaryColor}
          />
        )}

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {/* All tab */}
              <button
                onClick={() => handleCategorySelect(null)}
                className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={
                  selectedCategoryId === null
                    ? { backgroundColor: primaryColor, color: "#fff" }
                    : { backgroundColor: "#f3f4f6", color: "#374151" }
                }
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={
                    selectedCategoryId === cat.id
                      ? { backgroundColor: primaryColor, color: "#fff" }
                      : { backgroundColor: "#f3f4f6", color: "#374151" }
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="px-4 py-3">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-gray-400 hover:text-gray-600 text-lg leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Featured section */}
        {showFeatured && <FeaturedSection items={featuredItems} primaryColor={primaryColor} />}

        {/* Item grid */}
        <ItemGrid items={filteredItems} primaryColor={primaryColor} />
      </div>
      <CartFloatingButton primaryColor={primaryColor} />
    </CartProvider>
  );
}

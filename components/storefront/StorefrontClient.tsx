"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { CollectionChips } from "@/components/storefront/CollectionChips";
import { FeaturedSection } from "@/components/storefront/FeaturedSection";
import { ItemGrid } from "@/components/storefront/ItemGrid";
import { CartProvider } from "@/components/storefront/CartProvider";
import { CartFloatingButton } from "@/components/storefront/CartFloatingButton";
import { ScrollToTopButton } from "@/components/storefront/ScrollToTopButton";

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

  const allItems = items;

  const filteredItems = allItems.filter((item) => {
    if (selectedCollectionId) {
      const col = collections.find((c) => c.id === selectedCollectionId);
      if (col && !col.itemIds.includes(item.id)) return false;
    }
    if (selectedCategoryId) {
      if (item.categoryId !== selectedCategoryId) return false;
    }
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
    setSelectedCategoryId(null);
  };

  const handleCategorySelect = (id: string | null) => {
    setSelectedCategoryId(id);
    setSelectedCollectionId(null);
  };

  return (
    <CartProvider shopId={shopId} shopName={shopName} whatsappNumber={whatsappNumber ?? ""}>
      <div className="max-w-lg mx-auto pb-28">
        {/* Search bar */}
        <div className="px-5 pt-1 pb-3">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-[18px] h-[18px] text-ink-3 pointer-events-none" strokeWidth={2.2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the menu…"
              className="w-full pl-11 pr-11 py-3.5 rounded-2xl border-2 border-ink-line bg-paper-2 text-[15px] text-ink placeholder-ink-3 focus:outline-none focus:border-ink-line-strong transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 w-7 h-7 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-paper-3"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collection chips (curated) */}
        {collections.length > 0 && (
          <CollectionChips
            collections={collections}
            selected={selectedCollectionId}
            onSelect={handleCollectionSelect}
            primaryColor={primaryColor}
          />
        )}

        {/* Category tabs (navigation) */}
        {categories.length > 0 && (
          <nav className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md border-b border-ink-line">
            <div className="flex gap-1 overflow-x-auto px-3 scrollbar-hide">
              <CategoryTab
                label="All"
                active={selectedCategoryId === null}
                onClick={() => handleCategorySelect(null)}
                primaryColor={primaryColor}
              />
              {categories.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  label={cat.name}
                  active={selectedCategoryId === cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </nav>
        )}

        {/* Featured */}
        {showFeatured && <FeaturedSection items={featuredItems} primaryColor={primaryColor} />}

        {/* Item grid */}
        <ItemGrid items={filteredItems} primaryColor={primaryColor} />
      </div>
      <ScrollToTopButton />
      <CartFloatingButton primaryColor={primaryColor} />
    </CartProvider>
  );
}

function CategoryTab({
  label,
  active,
  onClick,
  primaryColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  primaryColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative whitespace-nowrap px-4 h-12 flex items-center font-display text-[15px] tracking-tight transition-colors ${
        active ? "text-ink font-semibold" : "text-ink-3 hover:text-ink-2"
      }`}
    >
      {label}
      {active && (
        <span
          className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full"
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </button>
  );
}

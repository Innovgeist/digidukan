"use client";

// Premium variant uses heritage chrome (cream / emerald / maroon / brass) but
// still applies each shop's primaryColor on functional accents — active states,
// CTA quantity-stepper increments, cart-button icon background.

import { useState } from "react";
import Image from "next/image";
import { Search, X, Plus, Minus } from "lucide-react";
import { CartProvider } from "@/components/storefront/CartProvider";
import { ScrollToTopButton } from "@/components/storefront/ScrollToTopButton";
import { ItemCardPremium } from "@/components/storefront/premium/ItemCardPremium";
import { CartFloatingButtonPremium } from "@/components/storefront/premium/CartFloatingButtonPremium";
import { useCart } from "@/lib/cart";
import { getCategoryIcon } from "@/lib/category-icon";

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

export function StorefrontClientPremium({
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

  const filteredItems = items.filter((item) => {
    if (selectedCollectionId) {
      const col = collections.find((c) => c.id === selectedCollectionId);
      if (col && !col.itemIds.includes(item.id)) return false;
    }
    if (selectedCategoryId && item.categoryId !== selectedCategoryId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const featuredItems = items.filter((i) => i.isFeatured && i.isAvailable);
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
      <div className="max-w-lg mx-auto pb-28 bg-[var(--color-heritage-cream)]">
        {/* Search */}
        <div className="px-5 pt-1 pb-4">
          <div className="relative flex items-center">
            <Search
              className="absolute left-4 w-[18px] h-[18px] text-[var(--color-heritage-brass-deep)] pointer-events-none"
              strokeWidth={1.6}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the catalogue…"
              className="w-full pl-11 pr-11 py-3 bg-[var(--color-heritage-ivory)] border border-[var(--color-heritage-brass)] text-[15px] font-[family-name:var(--font-inter)] text-[var(--color-heritage-ink)] placeholder-[var(--color-heritage-ink-mute)] focus:outline-none focus:border-[var(--color-heritage-emerald)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 w-7 h-7 flex items-center justify-center text-[var(--color-heritage-ink-mute)] hover:text-[var(--color-heritage-emerald)]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collection chips */}
        {collections.length > 0 && (
          <div className="px-5 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {collections.map((col) => {
                const active = selectedCollectionId === col.id;
                return (
                  <button
                    type="button"
                    key={col.id}
                    onClick={() =>
                      handleCollectionSelect(active ? null : col.id)
                    }
                    className={`whitespace-nowrap shrink-0 px-4 py-2 heritage-label text-[10px] border transition-colors ${
                      active
                        ? "border-transparent text-[var(--color-heritage-ivory)]"
                        : "bg-[var(--color-heritage-ivory)] border-[var(--color-heritage-brass)] text-[var(--color-heritage-emerald)] hover:bg-[var(--color-heritage-cream-soft)]"
                    }`}
                    style={
                      active
                        ? { backgroundColor: primaryColor }
                        : undefined
                    }
                  >
                    {col.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticky category tabs */}
        {categories.length > 0 && (
          <nav className="sticky top-0 z-20 bg-[var(--color-heritage-cream)]/95 backdrop-blur-md border-y border-[var(--color-heritage-brass)]/40">
            <div className="flex gap-1 overflow-x-auto px-3 scrollbar-hide">
              <CategoryTabPremium
                label="All"
                active={selectedCategoryId === null}
                onClick={() => handleCategorySelect(null)}
                primaryColor={primaryColor}
              />
              {categories.map((cat) => (
                <CategoryTabPremium
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
        {showFeatured && (
          <section className="px-5 pt-8 pb-2">
            <div className="text-center mb-4">
              <h2 className="font-[family-name:var(--font-heritage)] italic font-semibold text-[26px] text-[var(--color-heritage-emerald)] leading-tight">
                Today&apos;s Specialities
              </h2>
              <div className="flex justify-center mt-2">
                <span className="block w-10 h-px bg-[var(--color-heritage-brass)]" aria-hidden />
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              {featuredItems.map((item) => (
                <FeaturedCardPremium
                  key={item.id}
                  item={item}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </section>
        )}

        {/* Brass divider */}
        <div className="px-5 py-6">
          <div className="brass-divider" aria-hidden />
        </div>

        {/* Item grid */}
        <section className="px-5 pb-6">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="cartouche-frame inline-flex w-16 h-16 items-center justify-center mb-4 bg-[var(--color-heritage-ivory)]">
                <Search className="w-6 h-6 text-[var(--color-heritage-brass-deep)]" strokeWidth={1.4} />
              </div>
              <p className="font-[family-name:var(--font-heritage)] italic font-semibold text-[18px] text-[var(--color-heritage-emerald)] mb-1">
                Nothing in our catalogue matches.
              </p>
              <p className="font-[family-name:var(--font-inter)] text-[14px] text-[var(--color-heritage-ink-soft)]">
                Try a different term or clear the active filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <ItemCardPremium
                  key={item.id}
                  {...item}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <ScrollToTopButton />
      <CartFloatingButtonPremium primaryColor={primaryColor} />
    </CartProvider>
  );
}

function CategoryTabPremium({
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
      type="button"
      onClick={onClick}
      className={`relative whitespace-nowrap px-4 h-12 flex items-center font-[family-name:var(--font-heritage)] text-[14px] tracking-wide uppercase transition-colors ${
        active
          ? "text-[var(--color-heritage-emerald)] font-semibold"
          : "text-[var(--color-heritage-ink-mute)] hover:text-[var(--color-heritage-emerald)]"
      }`}
      style={{ letterSpacing: "0.08em" }}
    >
      {label}
      {active && (
        <span
          className="absolute bottom-0 left-3 right-3 h-[2px]"
          style={{ backgroundColor: primaryColor }}
          aria-hidden
        />
      )}
    </button>
  );
}

function FeaturedCardPremium({
  item,
  primaryColor,
}: {
  item: Item;
  primaryColor: string;
}) {
  const cart = useCart();
  const cartItem = cart.items.find((i) => i.itemId === item.id);
  const FallbackIcon = getCategoryIcon(item.name, item.categoryName);

  return (
    <div className="shrink-0 w-52 cartouche-frame bg-[var(--color-heritage-ivory)]">
      <div className="relative aspect-[4/3] mb-3 overflow-hidden bg-[var(--color-heritage-cream-soft)]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="208px"
            unoptimized={!item.imageUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FallbackIcon className="w-9 h-9 text-[var(--color-heritage-brass-deep)]" strokeWidth={1.4} />
          </div>
        )}
      </div>
      <div className="text-center pb-1">
        <h3
          className="font-[family-name:var(--font-heritage)] font-semibold text-[15px] uppercase text-[var(--color-heritage-emerald)] leading-tight line-clamp-2"
          style={{ letterSpacing: "0.04em" }}
        >
          {item.name}
        </h3>
        <p className="heritage-label text-[9px] text-[var(--color-heritage-brass-deep)] mt-1">
          Limited Release
        </p>
        <div className="flex items-baseline justify-center gap-2 mt-2 mb-2 tabular">
          <span className="font-[family-name:var(--font-heritage)] italic text-[var(--color-heritage-maroon-deep)] text-[14px]">
            ₹
          </span>
          <span className="font-[family-name:var(--font-inter)] font-semibold text-[15px] text-[var(--color-heritage-maroon-deep)]">
            {item.price.toLocaleString("en-IN")}
          </span>
          {item.oldPrice && (
            <span className="text-[11px] text-[var(--color-heritage-ink-mute)] line-through">
              ₹{item.oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {!item.isAvailable ? (
          <p className="heritage-label text-[9px] text-[var(--color-heritage-maroon-deep)] py-2">
            Currently Unavailable
          </p>
        ) : cartItem ? (
          <div className="flex items-center justify-between border border-[var(--color-heritage-emerald)]">
            <button
              type="button"
              onClick={() => cart.updateQuantity(item.id, cartItem.quantity - 1)}
              className="w-9 h-9 flex items-center justify-center text-[var(--color-heritage-emerald)]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span className="font-[family-name:var(--font-inter)] font-semibold text-[14px] text-[var(--color-heritage-emerald)] tabular">
              {cartItem.quantity}
            </span>
            <button
              type="button"
              onClick={() => cart.updateQuantity(item.id, cartItem.quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-[var(--color-heritage-ivory)]"
              style={{ backgroundColor: primaryColor }}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              cart.addItem({
                itemId: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
              })
            }
            className="w-full py-2.5 bg-[var(--color-heritage-maroon)] text-[var(--color-heritage-ivory)] heritage-label text-[10px] hover:bg-[var(--color-heritage-maroon-deep)] transition-colors"
          >
            Add to Order
          </button>
        )}
      </div>
    </div>
  );
}

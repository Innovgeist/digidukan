"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { Plus, Minus } from "lucide-react";
import { getCategoryIcon } from "@/lib/category-icon";

interface Props {
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
  primaryColor?: string;
}

function VegMarkPremium({ dietaryType }: { dietaryType: string }) {
  if (dietaryType !== "VEG" && dietaryType !== "NON_VEG" && dietaryType !== "EGG") return null;
  const dot =
    dietaryType === "VEG"
      ? "bg-[var(--color-heritage-emerald-2)] border-[var(--color-heritage-emerald-2)]"
      : dietaryType === "NON_VEG"
        ? "bg-[var(--color-heritage-maroon)] border-[var(--color-heritage-maroon)]"
        : "bg-[var(--color-heritage-brass-deep)] border-[var(--color-heritage-brass-deep)]";
  return (
    <span className="w-4 h-4 flex items-center justify-center border bg-[var(--color-heritage-ivory)] border-current">
      <span className={`block w-1.5 h-1.5 rounded-full ${dot.split(" ")[0]}`} />
    </span>
  );
}

export function ItemCardPremium({
  id,
  name,
  price,
  oldPrice,
  imageUrl,
  isAvailable,
  isBestseller,
  dietaryType,
  categoryName,
  primaryColor = "#003226",
}: Props) {
  const cart = useCart();
  const cartItem = cart.items.find((i) => i.itemId === id);
  const FallbackIcon = getCategoryIcon(name, categoryName);

  return (
    <article className="item-card-premium p-2 flex flex-col">
      <span className="brass-cap brass-cap-tl" aria-hidden />
      <span className="brass-cap brass-cap-br" aria-hidden />

      {/* Image */}
      <div className="relative aspect-square overflow-hidden mb-3 bg-[var(--color-heritage-cream-soft)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 430px) 50vw, 215px"
            unoptimized={!imageUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 flex items-center justify-center text-[var(--color-heritage-brass-deep)]">
              <FallbackIcon className="w-7 h-7" strokeWidth={1.4} />
            </span>
          </div>
        )}

        <div className="absolute top-1.5 right-1.5">
          <VegMarkPremium dietaryType={dietaryType} />
        </div>

        {isBestseller && (
          <div className="absolute top-1.5 left-1.5 bg-[var(--color-heritage-maroon)] text-[var(--color-heritage-ivory)] px-1.5 py-0.5">
            <span className="heritage-label text-[8px]">Reserved</span>
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-[var(--color-heritage-cream)]/85 flex items-center justify-center">
            <span className="bg-[var(--color-heritage-ivory)] border border-[var(--color-heritage-brass)] px-3 py-1 heritage-label text-[9px] text-[var(--color-heritage-maroon-deep)]">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <div className="px-1 text-center min-h-[3.25rem]">
        <h3
          className="font-[family-name:var(--font-heritage)] font-semibold text-[14px] leading-tight tracking-wide uppercase text-[var(--color-heritage-emerald)] line-clamp-2"
          style={{ letterSpacing: "0.04em" }}
        >
          {name}
        </h3>
      </div>

      {/* Brass hairline */}
      <div className="flex justify-center my-2" aria-hidden>
        <span className="block w-6 h-px bg-[var(--color-heritage-brass)]" />
      </div>

      {/* Price */}
      <div className="px-1 text-center mb-3">
        <span className="font-[family-name:var(--font-heritage)] italic text-[var(--color-heritage-maroon-deep)] text-[15px]">
          ₹
        </span>
        <span className="font-[family-name:var(--font-inter)] font-semibold text-[15px] text-[var(--color-heritage-maroon-deep)] tabular ml-0.5">
          {price.toLocaleString("en-IN")}
        </span>
        {oldPrice && (
          <span className="ml-2 text-[12px] text-[var(--color-heritage-ink-mute)] line-through tabular">
            ₹{oldPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        {cartItem ? (
          <div className="flex items-center justify-between gap-1 border border-[var(--color-heritage-emerald)]">
            <button
              type="button"
              onClick={() => cart.updateQuantity(id, cartItem.quantity - 1)}
              className="w-9 h-9 flex items-center justify-center text-[var(--color-heritage-emerald)] hover:bg-[var(--color-heritage-cream-soft)] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span className="font-[family-name:var(--font-inter)] font-semibold text-[14px] text-[var(--color-heritage-emerald)] tabular">
              {cartItem.quantity}
            </span>
            <button
              type="button"
              onClick={() => cart.updateQuantity(id, cartItem.quantity + 1)}
              className="w-9 h-9 flex items-center justify-center text-[var(--color-heritage-ivory)] transition-colors"
              style={{ backgroundColor: primaryColor }}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => cart.addItem({ itemId: id, name, price, imageUrl })}
            className="w-full py-2.5 bg-[var(--color-heritage-maroon)] text-[var(--color-heritage-ivory)] heritage-label text-[10px] hover:bg-[var(--color-heritage-maroon-deep)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAvailable ? "Add to Order" : "Sold Out"}
          </button>
        )}
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import { Plus, Minus, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getCategoryIcon } from "@/lib/category-icon";

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

function VegDot({ dietaryType }: { dietaryType: string }) {
  const tone =
    dietaryType === "VEG"
      ? "border-leaf bg-leaf"
      : dietaryType === "NON_VEG"
        ? "border-brick bg-brick"
        : dietaryType === "EGG"
          ? "border-egg bg-egg"
          : null;
  if (!tone) return null;
  return (
    <span className="w-3.5 h-3.5 flex items-center justify-center rounded-[3px] bg-paper-2 border-2 border-current shrink-0 text-[10px]">
      <span className={`block w-1.5 h-1.5 rounded-full ${tone.split(" ")[1]}`} />
    </span>
  );
}

function FeaturedCard({ item, primaryColor }: { item: Item; primaryColor: string }) {
  const cart = useCart();
  const cartItem = cart.items.find((i) => i.itemId === item.id);
  const FallbackIcon = getCategoryIcon(item.name, item.categoryName);

  return (
    <div className="shrink-0 w-44 bg-paper-2 rounded-[18px] border border-ink-line shadow-[0_2px_0_rgba(31,24,18,0.05)] overflow-hidden flex flex-col">
      <div className="relative w-full h-32">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="176px"
            unoptimized={!item.imageUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="absolute inset-0 bg-paper-3 flex items-center justify-center">
            <div className="absolute inset-0 bg-grain opacity-50" />
            <span
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}1f`, color: primaryColor }}
            >
              <FallbackIcon className="w-6 h-6" strokeWidth={1.6} />
            </span>
          </div>
        )}
        <span className="absolute top-1.5 right-1.5">
          <VegDot dietaryType={item.dietaryType} />
        </span>
      </div>

      <div className="p-2.5 flex flex-col flex-1">
        <p className="font-display font-semibold text-[13.5px] text-ink leading-snug line-clamp-2 tracking-tight">
          {item.name}
        </p>
        <div className="flex items-baseline gap-1.5 mt-1.5 mb-2 tabular">
          <span className="font-display font-bold text-[15px] text-ink">
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          {item.oldPrice && (
            <span className="text-[11px] text-ink-3 line-through">
              ₹{item.oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="mt-auto">
          {!item.isAvailable ? (
            <p className="text-[11px] text-brick font-medium text-center py-1.5">Sold Out</p>
          ) : cartItem ? (
            <div className="flex items-center justify-between bg-paper-3 rounded-xl p-0.5">
              <button
                onClick={() => cart.updateQuantity(item.id, cartItem.quantity - 1)}
                className="press-soft w-9 h-9 rounded-lg bg-paper-2 border border-ink-line flex items-center justify-center text-ink-2"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={2.4} />
              </button>
              <span className="font-display font-bold text-[14px] text-ink tabular">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => cart.updateQuantity(item.id, cartItem.quantity + 1)}
                className="press-soft w-9 h-9 rounded-lg flex items-center justify-center text-paper"
                style={{ backgroundColor: primaryColor }}
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                cart.addItem({ itemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl })
              }
              className="press-soft w-full h-10 rounded-xl text-[13px] font-semibold text-paper flex items-center justify-center gap-1 shadow-[0_2px_0_rgba(31,24,18,0.12)]"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.6} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedSection({ items, primaryColor = "#D9622E" }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-[18px] h-[18px]" style={{ color: primaryColor }} strokeWidth={2.2} />
        <h2 className="font-display font-semibold text-[18px] text-ink tracking-tight">
          Featured today
        </h2>
        <span className="rule-line flex-1 ml-1 opacity-70" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {items.map((item) => (
          <FeaturedCard key={item.id} item={item} primaryColor={primaryColor} />
        ))}
      </div>
    </div>
  );
}

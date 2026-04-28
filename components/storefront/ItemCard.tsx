"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { Star, Plus, Minus, Sparkles } from "lucide-react";
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

function VegMark({ dietaryType }: { dietaryType: string }) {
  if (dietaryType !== "VEG" && dietaryType !== "NON_VEG" && dietaryType !== "EGG") return null;
  const tone =
    dietaryType === "VEG" ? "border-leaf" : dietaryType === "NON_VEG" ? "border-brick" : "border-egg";
  const dot =
    dietaryType === "VEG" ? "bg-leaf" : dietaryType === "NON_VEG" ? "bg-brick" : "bg-egg";
  return (
    <span
      className={`w-[18px] h-[18px] flex items-center justify-center border-2 ${tone} bg-paper-2 rounded-[3px]`}
      title={dietaryType === "VEG" ? "Vegetarian" : dietaryType === "NON_VEG" ? "Non-Vegetarian" : "Contains Egg"}
    >
      {dietaryType === "EGG" ? (
        <span className="block w-2 h-2.5 rounded-full bg-egg" />
      ) : (
        <span className={`block w-2 h-2 rounded-full ${dot}`} />
      )}
    </span>
  );
}

export function ItemCard({
  id,
  name,
  price,
  oldPrice,
  description,
  imageUrl,
  isAvailable,
  isBestseller,
  dietaryType,
  categoryName,
  primaryColor = "#D9622E",
}: Props) {
  const cart = useCart();
  const cartItem = cart.items.find((i) => i.itemId === id);
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const FallbackIcon = getCategoryIcon(name, categoryName);

  return (
    <article className="group bg-paper-2 rounded-[20px] border border-ink-line shadow-[0_2px_0_rgba(31,24,18,0.05)] overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="relative w-full aspect-square">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 430px) 50vw, 215px"
              unoptimized={!imageUrl.includes("res.cloudinary.com")}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-paper-3">
            <div className="absolute inset-0 bg-grain opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              <span
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                style={{
                  backgroundColor: `${primaryColor}1f`,
                  color: primaryColor,
                }}
              >
                <FallbackIcon className="w-8 h-8" strokeWidth={1.6} />
              </span>
              <p className="font-display text-[13px] font-medium text-ink-2 text-center leading-tight line-clamp-2 tracking-tight">
                {name}
              </p>
            </div>
          </div>
        )}

        {/* Veg / non-veg mark — top-right */}
        <div className="absolute top-2 right-2">
          <VegMark dietaryType={dietaryType} />
        </div>

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {isBestseller && (
            <span className="stamp inline-flex items-center gap-1 bg-mango text-ink text-[10px] font-bold px-2 py-1 rounded-md shadow-sm -rotate-2">
              <Star className="w-3 h-3" fill="currentColor" strokeWidth={0} />
              Bestseller
            </span>
          )}
          {discount > 0 && isAvailable && (
            <span className="stamp inline-flex items-center gap-1 bg-leaf text-paper text-[10px] font-bold px-2 py-1 rounded-md shadow-sm rotate-1">
              <Sparkles className="w-3 h-3" strokeWidth={2.4} />
              {discount}% off
            </span>
          )}
        </div>

        {/* Out of stock */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-paper/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="stamp font-bold text-[11px] tracking-[0.2em] text-brick bg-paper-2 px-3 py-1.5 rounded-md border-2 border-brick/40 -rotate-6 shadow-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[16px] text-ink leading-snug line-clamp-2 tracking-tight">
          {name}
        </h3>

        {description && (
          <p className="text-[13px] text-ink-3 leading-snug line-clamp-2 mt-1">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3 mb-3 tabular">
          <span className="font-display font-bold text-[20px] text-ink leading-none">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {oldPrice && (
            <span className="text-[13px] text-ink-3 line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {cartItem ? (
            <div className="flex items-center justify-between gap-2 bg-paper-3 rounded-2xl p-1">
              <button
                onClick={() => cart.updateQuantity(id, cartItem.quantity - 1)}
                className="press-soft w-10 h-10 rounded-xl bg-paper-2 border border-ink-line flex items-center justify-center text-ink-2 hover:text-ink shrink-0"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" strokeWidth={2.4} />
              </button>
              <span className="font-display font-bold text-[18px] text-ink tabular">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => cart.updateQuantity(id, cartItem.quantity + 1)}
                className="press-soft w-10 h-10 rounded-xl flex items-center justify-center text-paper shrink-0 shadow-sm"
                style={{ backgroundColor: primaryColor }}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <button
              disabled={!isAvailable}
              onClick={() => cart.addItem({ itemId: id, name, price, imageUrl })}
              className="press-soft w-full h-11 rounded-2xl text-[14px] font-semibold text-paper transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-[0_2px_0_rgba(31,24,18,0.12)]"
              style={{ backgroundColor: primaryColor }}
            >
              {isAvailable ? (
                <>
                  <Plus className="w-4 h-4" strokeWidth={2.6} />
                  Add to Cart
                </>
              ) : (
                "Unavailable"
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

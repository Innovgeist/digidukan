"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Star, Plus, Minus } from "lucide-react";

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

function DietaryBadge({ dietaryType }: { dietaryType: string }) {
  if (dietaryType === "VEG")
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
        <span className="w-2 h-2 rounded-full bg-green-500" /> Veg
      </span>
    );
  if (dietaryType === "NON_VEG")
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
        <span className="w-2 h-2 rounded-full bg-red-500" /> Non-Veg
      </span>
    );
  if (dietaryType === "EGG")
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
        <span className="w-2 h-2 rounded-full bg-amber-500" /> Egg
      </span>
    );
  return null;
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
  primaryColor = "#3B82F6",
}: Props) {
  const cart = useCart();
  const cartItem = cart.items.find((i) => i.itemId === id);

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Image area */}
      <div
        className="relative w-full aspect-square"
        style={{
          background: imageUrl
            ? "#f9fafb"
            : `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
        }}
      >
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
          <div className="w-full h-full flex items-center justify-center p-4">
            <p className="text-sm font-semibold text-center leading-tight line-clamp-3" style={{ color: `${primaryColor}90` }}>
              {name}
            </p>
          </div>
        )}

        {/* Out of Stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-gray-700 text-xs font-semibold bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isBestseller && (
            <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
              <Star className="w-3 h-3" fill="white" />
              Bestseller
            </span>
          )}
          {discount > 0 && isAvailable && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
              {discount}% off
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Dietary badge */}
        {dietaryType !== "NA" && (
          <div className="mb-1.5">
            <DietaryBadge dietaryType={dietaryType} />
          </div>
        )}

        {/* Name */}
        <p className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2 mb-0.5">
          {name}
        </p>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-1.5">
            {description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mt-auto mb-2.5">
          <span className="font-bold text-base" style={{ color: primaryColor }}>
            ₹{price.toLocaleString("en-IN")}
          </span>
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart / Quantity selector */}
        {cartItem ? (
          <div className="flex items-center justify-between gap-1 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => cart.updateQuantity(id, cartItem.quantity - 1)}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 flex-shrink-0"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="flex-1 text-center text-sm font-bold" style={{ color: primaryColor }}>
              {cartItem.quantity}
            </span>
            <button
              onClick={() => cart.updateQuantity(id, cartItem.quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            disabled={!isAvailable}
            onClick={() => cart.addItem({ itemId: id, name, price, imageUrl })}
            className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            {isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        )}
      </div>
    </div>
  );
}

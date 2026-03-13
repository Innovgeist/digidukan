"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";

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

function DietaryDot({ dietaryType }: { dietaryType: string }) {
  if (dietaryType === "VEG") return <span className="text-xs" title="Veg">🟢</span>;
  if (dietaryType === "NON_VEG") return <span className="text-xs" title="Non-Veg">🔴</span>;
  if (dietaryType === "EGG") return <span className="text-xs" title="Egg">🥚</span>;
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
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="relative w-full aspect-square bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            unoptimized={!imageUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🛍️</span>
          </div>
        )}

        {/* Out of Stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-gray-800/80 px-2 py-1 rounded-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Bestseller badge */}
        {isBestseller && (
          <div className="absolute top-1.5 left-1.5">
            <span className="bg-orange-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md">
              Bestseller
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col flex-1">
        {/* Dietary + Name row */}
        <div className="flex items-start gap-1 mb-1">
          <div className="mt-0.5 flex-shrink-0">
            <DietaryDot dietaryType={dietaryType} />
          </div>
          <p className="font-medium text-sm text-gray-900 leading-tight line-clamp-2">
            {name}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-1.5">
            {description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-1 mt-auto mb-2">
          <span className="font-bold text-sm" style={{ color: primaryColor }}>
            ₹{price}
          </span>
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}
        </div>

        {/* Add to Cart / Quantity selector */}
        {cartItem ? (
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => cart.updateQuantity(id, cartItem.quantity - 1)}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm font-bold flex-shrink-0"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-semibold" style={{ color: primaryColor }}>
              {cartItem.quantity}
            </span>
            <button
              onClick={() => cart.updateQuantity(id, cartItem.quantity + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              +
            </button>
          </div>
        ) : (
          <button
            disabled={!isAvailable}
            onClick={() => cart.addItem({ itemId: id, name, price, imageUrl })}
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
          >
            {isAvailable ? "Add" : "Out of Stock"}
          </button>
        )}
      </div>
    </div>
  );
}

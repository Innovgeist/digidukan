"use client";

import Image from "next/image";
import { Sparkles, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart";

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

function dietaryDot(dietaryType: string) {
  if (dietaryType === "VEG") return <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />;
  if (dietaryType === "NON_VEG") return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />;
  if (dietaryType === "EGG") return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
  return null;
}

function FeaturedCard({ item, primaryColor }: { item: Item; primaryColor: string }) {
  const cart = useCart();
  const cartItem = cart.items.find((i) => i.itemId === item.id);

  return (
    <div className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div
        className="relative w-full h-28"
        style={{
          background: item.imageUrl
            ? undefined
            : `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
        }}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="160px"
            unoptimized={!item.imageUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-3">
            <p className="text-xs font-semibold text-center leading-tight line-clamp-2" style={{ color: `${primaryColor}90` }}>
              {item.name}
            </p>
          </div>
        )}
      </div>

      <div className="p-2.5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          {dietaryDot(item.dietaryType)}
          <p className="text-xs font-medium text-gray-900 truncate flex-1">
            {item.name}
          </p>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-sm font-bold" style={{ color: primaryColor }}>
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          {item.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{item.oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to cart / quantity */}
        <div className="mt-auto">
          {!item.isAvailable ? (
            <p className="text-xs text-gray-400 text-center py-1">Out of stock</p>
          ) : cartItem ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-0.5">
              <button
                onClick={() => cart.updateQuantity(item.id, cartItem.quantity - 1)}
                className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold" style={{ color: primaryColor }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => cart.updateQuantity(item.id, cartItem.quantity + 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => cart.addItem({ itemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl })}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-all active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedSection({ items, primaryColor = "#3B82F6" }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="px-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
        <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
        Featured
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <FeaturedCard key={item.id} item={item} primaryColor={primaryColor} />
        ))}
      </div>
    </div>
  );
}

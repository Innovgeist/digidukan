"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toggleItemAvailabilityAction, deleteItemAction } from "@/lib/actions/item";
import Image from "next/image";

interface Item {
  id: string; name: string; price: number; oldPrice: number | null;
  imageUrl: string; isAvailable: boolean; isFeatured: boolean; isBestseller: boolean;
  categoryName: string | null; itemType: string; dietaryType: string;
}

interface Props {
  shopId: string;
  items: Item[];
  categories: { id: string; name: string }[];
}

export function ItemList({ shopId, items: initial }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "available" | "unavailable" | "featured">("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = initial.filter((i) => {
    if (filter === "available") return i.isAvailable;
    if (filter === "unavailable") return !i.isAvailable;
    if (filter === "featured") return i.isFeatured;
    return true;
  });

  async function handleToggle(itemId: string) {
    setLoading(itemId);
    await toggleItemAvailabilityAction(itemId);
    router.refresh();
    setLoading(null);
  }

  async function handleDelete(itemId: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(itemId);
    await deleteItemAction(itemId);
    router.refresh();
    setLoading(null);
  }

  const dietaryColors: Record<string, string> = {
    VEG: "text-green-600 border-green-400",
    NON_VEG: "text-red-600 border-red-400",
    EGG: "text-yellow-600 border-yellow-400",
    NA: "",
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "available", "unavailable", "featured"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === f ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No items found.</p>
          <Link href={`/shops/${shopId}/items/new`} className="mt-3 inline-block text-blue-600 text-sm hover:underline">Add your first item →</Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${!item.isAvailable ? "opacity-60" : "border-gray-200"}`}>
              {/* Image */}
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">🛍️</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  {item.isFeatured && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded">Featured</span>}
                  {item.isBestseller && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 rounded">Bestseller</span>}
                  {!item.isAvailable && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 rounded">Out of stock</span>}
                  {item.dietaryType !== "NA" && (
                    <span className={`text-xs border rounded px-1 ${dietaryColors[item.dietaryType] ?? ""}`}>
                      {item.dietaryType === "VEG" ? "🟢" : item.dietaryType === "NON_VEG" ? "🔴" : "🥚"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-medium text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                  {item.oldPrice && <span className="text-xs text-gray-400 line-through">₹{item.oldPrice.toLocaleString("en-IN")}</span>}
                  {item.categoryName && <span className="text-xs text-gray-400">· {item.categoryName}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(item.id)}
                  disabled={loading === item.id}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${item.isAvailable ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                >
                  {loading === item.id ? "..." : item.isAvailable ? "Mark OOS" : "Mark Available"}
                </button>
                <Link href={`/shops/${shopId}/items/${item.id}`} className="text-xs border border-blue-200 text-blue-600 px-2 py-1 rounded hover:bg-blue-50">
                  Edit
                </Link>
                <button onClick={() => handleDelete(item.id, item.name)} disabled={loading === item.id} className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-40">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

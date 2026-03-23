"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleItemAvailabilityAction, deleteItemAction } from "@/lib/actions/item";
import Image from "next/image";
import { Pencil, Trash2, ShoppingBag, Eye, EyeOff } from "lucide-react";

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
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-500 text-sm">No items found.</p>
          <Link href={`/shops/${shopId}/items/new`} className="mt-3 inline-block text-blue-600 text-sm hover:underline">
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl border p-4 ${!item.isAvailable ? "opacity-60" : "border-gray-200"}`}>
              <div className="flex items-start gap-3">
                {/* Image */}
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-gray-400" />
                    </div>
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
              </div>

              {/* Actions — separate row on mobile */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggle(item.id)}
                  disabled={loading === item.id}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${item.isAvailable ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                >
                  {loading === item.id ? "..." : item.isAvailable ? (
                    <><EyeOff className="w-3 h-3" /> Mark OOS</>
                  ) : (
                    <><Eye className="w-3 h-3" /> Available</>
                  )}
                </button>
                <Link
                  href={`/shops/${shopId}/items/${item.id}`}
                  className="inline-flex items-center gap-1 text-xs border border-blue-200 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={loading === item.id}
                  className="inline-flex items-center gap-1 text-xs border border-red-200 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
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

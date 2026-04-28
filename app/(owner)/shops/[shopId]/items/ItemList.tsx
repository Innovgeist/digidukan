"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleItemAvailabilityAction, deleteItemAction } from "@/lib/actions/item";
import Image from "next/image";
import { Pencil, Trash2, ShoppingBag, Eye, EyeOff, MoreVertical } from "lucide-react";

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

function DietaryDot({ type }: { type: string }) {
  const tone =
    type === "VEG"
      ? { bg: "bg-green-500", border: "border-green-500", label: "Veg" }
      : type === "NON_VEG"
        ? { bg: "bg-red-500", border: "border-red-500", label: "Non-Veg" }
        : type === "EGG"
          ? { bg: "bg-amber-500", border: "border-amber-500", label: "Egg" }
          : null;
  if (!tone) return null;
  return (
    <span
      className={`inline-flex items-center justify-center w-3.5 h-3.5 border-2 ${tone.border} bg-white rounded-[3px]`}
      title={tone.label}
    >
      <span className={`block w-1.5 h-1.5 rounded-full ${tone.bg}`} />
    </span>
  );
}

export function ItemList({ shopId, items: initial }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "available" | "unavailable" | "featured">("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const filtered = initial.filter((i) => {
    if (filter === "available") return i.isAvailable;
    if (filter === "unavailable") return !i.isAvailable;
    if (filter === "featured") return i.isFeatured;
    return true;
  });

  async function handleToggle(itemId: string) {
    setOpenMenu(null);
    setLoading(itemId);
    await toggleItemAvailabilityAction(itemId);
    router.refresh();
    setLoading(null);
  }

  async function handleDelete(itemId: string, name: string) {
    setOpenMenu(null);
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(itemId);
    await deleteItemAction(itemId);
    router.refresh();
    setLoading(null);
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "available", "unavailable", "featured"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3.5 py-2 rounded-full border transition-colors ${
              filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-600 hover:border-gray-400 bg-white"
            }`}
          >
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
          <Link
            href={`/shops/${shopId}/items/new`}
            className="mt-3 inline-block text-blue-600 text-sm hover:underline"
          >
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-3.5 relative flex items-start gap-3 ${
                !item.isAvailable ? "opacity-70" : "border-gray-200"
              }`}
            >
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
                  <DietaryDot type={item.dietaryType} />
                  <span className="font-medium text-gray-900 text-sm leading-tight">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                  {item.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.oldPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {item.categoryName && (
                    <span className="text-xs text-gray-500">· {item.categoryName}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {item.isFeatured && (
                    <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Featured</span>
                  )}
                  {item.isBestseller && (
                    <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Bestseller</span>
                  )}
                  {!item.isAvailable && (
                    <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Out of stock</span>
                  )}
                </div>
              </div>

              {/* Overflow menu */}
              <div className="relative shrink-0" ref={openMenu === item.id ? menuRef : undefined}>
                <button
                  onClick={() => setOpenMenu((cur) => (cur === item.id ? null : item.id))}
                  disabled={loading === item.id}
                  aria-label="More actions"
                  className="w-11 h-11 -mr-2 -mt-1 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openMenu === item.id && (
                  <div className="absolute right-0 top-12 z-30 w-52 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden animate-fade-in">
                    <button
                      onClick={() => handleToggle(item.id)}
                      disabled={loading === item.id}
                      className="w-full h-11 px-4 flex items-center gap-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      {item.isAvailable ? (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-500" />
                          Mark out of stock
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-green-600" />
                          Mark available
                        </>
                      )}
                    </button>
                    <Link
                      href={`/shops/${shopId}/items/${item.id}`}
                      onClick={() => setOpenMenu(null)}
                      className="w-full h-11 px-4 flex items-center gap-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                      Edit item
                    </Link>
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={loading === item.id}
                      className="w-full h-11 px-4 flex items-center gap-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

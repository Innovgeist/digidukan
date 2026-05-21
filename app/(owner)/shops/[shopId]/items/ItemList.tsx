"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  toggleItemAvailabilityAction,
  deleteItemAction,
} from "@/lib/actions/item";
import {
  Pencil,
  Trash2,
  ShoppingBag,
  Search,
  Tag,
  Package,
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  categoryName: string | null;
  itemType: string;
  dietaryType: string;
}

interface Props {
  shopId: string;
  items: Item[];
  categories: { id: string; name: string }[];
}

function DietaryDot({ type }: { type: string }) {
  const tone =
    type === "VEG"
      ? { bg: "bg-secondary", border: "border-secondary", label: "Veg" }
      : type === "NON_VEG"
        ? { bg: "bg-error", border: "border-error", label: "Non-Veg" }
        : type === "EGG"
          ? {
              bg: "bg-tertiary-fixed-dim",
              border: "border-tertiary",
              label: "Egg",
            }
          : null;
  if (!tone) return null;
  return (
    <span
      className={`inline-flex items-center justify-center w-3.5 h-3.5 border-2 ${tone.border} bg-surface-container-lowest rounded-[3px]`}
      title={tone.label}
    >
      <span className={`block w-1.5 h-1.5 rounded-full ${tone.bg}`} />
    </span>
  );
}

export function ItemList({ shopId, items: initial, categories }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "in-stock" | "out-of-stock"
  >("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = initial.filter((i) => {
    if (search.trim() && !i.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (categoryFilter !== "all" && i.categoryName !== categoryFilterToName(categoryFilter, categories))
      return false;
    if (availabilityFilter === "in-stock" && !i.isAvailable) return false;
    if (availabilityFilter === "out-of-stock" && i.isAvailable) return false;
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

  return (
    <div>
      {/* Toolbar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-stitch-1 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-bright text-on-surface text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-4 rounded-lg border border-outline-variant bg-surface-bright text-on-surface text-sm font-[family-name:var(--font-inter)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) =>
              setAvailabilityFilter(
                e.target.value as "all" | "in-stock" | "out-of-stock"
              )
            }
            className="h-11 px-4 rounded-lg border border-outline-variant bg-surface-bright text-on-surface text-sm font-[family-name:var(--font-inter)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center mb-3">
            <ShoppingBag className="w-7 h-7 text-primary" strokeWidth={2} />
          </div>
          <p className="text-on-surface-variant text-sm">No items found.</p>
          <Link
            href={`/shops/${shopId}/items/new`}
            className="mt-3 inline-block text-primary text-sm font-medium hover:underline font-[family-name:var(--font-inter)]"
          >
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-stitch-2 transition-shadow ${
                !item.isAvailable ? "opacity-75" : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center ${
                  !item.isAvailable ? "grayscale" : ""
                }`}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-7 h-7 text-outline" strokeWidth={1.6} />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <DietaryDot type={item.dietaryType} />
                  <h3 className="text-lg font-semibold text-on-surface truncate">
                    {item.name}
                  </h3>
                  {item.isBestseller && (
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/30 text-tertiary font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wider">
                      Bestseller
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {!item.isAvailable && (
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wider">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-on-surface-variant text-sm font-[family-name:var(--font-inter)] flex-wrap">
                  {item.categoryName && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" strokeWidth={2} />
                      {item.categoryName}
                    </span>
                  )}
                  {item.oldPrice && (
                    <span className="text-error font-medium line-through decoration-error/50">
                      ₹{item.oldPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-on-surface font-semibold text-lg">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-outline-variant/30">
                <label className="relative inline-flex items-center cursor-pointer mr-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.isAvailable}
                    disabled={loading === item.id}
                    onChange={() => handleToggle(item.id)}
                  />
                  <div className="w-11 h-6 bg-surface-container-high rounded-full peer-checked:bg-secondary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
                <Link
                  href={`/shops/${shopId}/items/${item.id}`}
                  title="Edit"
                  className="p-2 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" strokeWidth={2} />
                </Link>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={loading === item.id}
                  title="Delete"
                  className="p-2 text-outline hover:text-error hover:bg-error-container/50 rounded-lg transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function categoryFilterToName(
  id: string,
  categories: { id: string; name: string }[]
): string | null {
  const c = categories.find((x) => x.id === id);
  return c?.name ?? null;
}

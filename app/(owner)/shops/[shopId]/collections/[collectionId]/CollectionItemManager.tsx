"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Package } from "lucide-react";
import {
  addItemToCollectionAction,
  removeItemFromCollectionAction,
} from "@/lib/actions/collection";

interface ItemCard {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string | null;
}

interface Props {
  shopId: string;
  collectionId: string;
  collectionName: string;
  collectionItems: ItemCard[];
  availableItems: ItemCard[];
}

export function CollectionItemManager({
  shopId,
  collectionId,
  collectionName,
  collectionItems,
  availableItems,
}: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(itemId: string) {
    setLoadingId(itemId);
    setError(null);
    const result = await removeItemFromCollectionAction(collectionId, itemId);
    if (result.success) router.refresh();
    else setError("Failed to remove item");
    setLoadingId(null);
  }

  async function handleAdd(itemId: string) {
    setLoadingId(itemId);
    setError(null);
    const result = await addItemToCollectionAction(collectionId, itemId);
    if (result.success) router.refresh();
    else setError("Failed to add item");
    setLoadingId(null);
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg p-3 flex items-start justify-between gap-2">
          <p className="text-on-error-container text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* In collection */}
      <section>
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          Items in &ldquo;{collectionName}&rdquo;{" "}
          <span className="text-on-surface-variant font-medium">
            ({collectionItems.length})
          </span>
        </h2>
        {collectionItems.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-10 text-center">
            <p className="text-on-surface-variant text-sm">
              No items in this collection yet.
            </p>
            <p className="text-outline text-xs mt-1">
              Add items from the section below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {collectionItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                action="remove"
                loading={loadingId === item.id}
                onClick={() => handleRemove(item.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Available */}
      <section>
        <h2 className="text-xl font-semibold text-on-surface mb-4">
          Add Items{" "}
          <span className="text-on-surface-variant font-medium">
            ({availableItems.length} available)
          </span>
        </h2>
        {availableItems.length === 0 ? (
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-10 text-center">
            <p className="text-on-surface-variant text-sm">
              All shop items are already in this collection.
            </p>
            <Link
              href={`/shops/${shopId}/items`}
              className="text-primary text-sm font-medium hover:underline mt-1 inline-block font-[family-name:var(--font-inter)]"
            >
              Manage items →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availableItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                action="add"
                loading={loadingId === item.id}
                onClick={() => handleAdd(item.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ItemRow({
  item,
  action,
  loading,
  onClick,
}: {
  item: ItemCard;
  action: "add" | "remove";
  loading: boolean;
  onClick: () => void;
}) {
  const isRemove = action === "remove";
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 p-3 flex items-center gap-3">
      {item.imageUrl ? (
        <div className="relative w-14 h-14 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
            sizes="56px"
          />
        </div>
      ) : (
        <div className="w-14 h-14 flex-shrink-0 bg-surface-container rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-outline" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-on-surface truncate">
          {item.name}
        </p>
        {item.categoryName && (
          <p className="text-xs text-on-surface-variant truncate">
            {item.categoryName}
          </p>
        )}
        <p className="text-sm text-on-surface font-semibold mt-0.5 font-[family-name:var(--font-inter)]">
          ₹{item.price.toFixed(2)}
        </p>
      </div>
      <button
        onClick={onClick}
        disabled={loading}
        className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium font-[family-name:var(--font-inter)] rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 ${
          isRemove
            ? "border-error/30 text-error hover:bg-error-container/40"
            : "border-primary/30 text-primary hover:bg-primary-container/10"
        }`}
      >
        {loading ? (
          "..."
        ) : isRemove ? (
          <>
            <Minus className="w-3.5 h-3.5" strokeWidth={2.4} />
            Remove
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" strokeWidth={2.4} />
            Add
          </>
        )}
      </button>
    </div>
  );
}

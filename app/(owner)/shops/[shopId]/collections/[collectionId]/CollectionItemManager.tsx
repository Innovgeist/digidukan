"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addItemToCollectionAction,
  removeItemFromCollectionAction,
} from "@/lib/actions/collection";
import Image from "next/image";

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-xs text-red-400 hover:underline mt-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Current items in collection */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Items in &ldquo;{collectionName}&rdquo; ({collectionItems.length})
        </h2>
        {collectionItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">No items in this collection yet.</p>
            <p className="text-gray-400 text-xs mt-1">Add items from the section below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {collectionItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3"
              >
                {item.imageUrl ? (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No img</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  {item.categoryName && (
                    <p className="text-xs text-gray-400 truncate">{item.categoryName}</p>
                  )}
                  <p className="text-xs text-gray-600 font-medium">
                    &#8377;{item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={loadingId === item.id}
                  className="flex-shrink-0 text-xs text-red-500 hover:underline border border-red-200 rounded px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loadingId === item.id ? "..." : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Available items to add */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Add Items ({availableItems.length} available)
        </h2>
        {availableItems.length === 0 ? (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">All shop items are already in this collection.</p>
            <a
              href={`/shops/${shopId}/items`}
              className="text-blue-500 text-xs hover:underline mt-1 inline-block"
            >
              Manage items &rarr;
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3"
              >
                {item.imageUrl ? (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No img</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  {item.categoryName && (
                    <p className="text-xs text-gray-400 truncate">{item.categoryName}</p>
                  )}
                  <p className="text-xs text-gray-600 font-medium">
                    &#8377;{item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(item.id)}
                  disabled={loadingId === item.id}
                  className="flex-shrink-0 text-xs text-blue-600 hover:underline border border-blue-200 rounded px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loadingId === item.id ? "..." : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="pt-2">
        <a
          href={`/shops/${shopId}/collections`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Collections
        </a>
      </div>
    </div>
  );
}

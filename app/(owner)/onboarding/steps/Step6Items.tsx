"use client";
import { useState } from "react";
import { createItemAction } from "@/lib/actions/item";
import { advanceOnboardingStep } from "@/lib/actions/shop";

interface Props { onNext: () => void; shopId: string | null; shopSlug: string | null }
interface QuickItem { name: string; price: string }

export function Step6Items({ onNext, shopId }: Props) {
  const [items, setItems] = useState<QuickItem[]>([{ name: "", price: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateItem(i: number, field: keyof QuickItem, value: string) {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  function addItem() {
    if (items.length < 3) setItems((prev) => [...prev, { name: "", price: "" }]);
  }

  async function handleSubmit() {
    if (!shopId) return;
    setLoading(true);
    setError(null);

    const validItems = items.filter((i) => i.name.trim() && i.price.trim());
    if (validItems.length === 0) { setError("Add at least 1 item to continue."); setLoading(false); return; }

    for (const item of validItems) {
      const result = await createItemAction(shopId, {
        name: item.name,
        price: item.price,
        itemType: "PRODUCT",
        isAvailable: true,
        isFeatured: false,
        isBestseller: false,
        displayOrder: 0,
        dietaryType: "NA",
      });
      if (result.error) { setError(result.error); setLoading(false); return; }
    }

    await advanceOnboardingStep(6);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Add your first items</h2>
      <p className="text-gray-500 text-sm mb-6">Add 1–3 items to get started. You can add more later.</p>

      <div className="space-y-3 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                value={item.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder={`Item ${i + 1} name`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-28">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="bg-gray-50 text-gray-500 text-sm px-2 py-2 border-r border-gray-300">₹</span>
                <input
                  value={item.price}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                  placeholder="Price"
                  className="flex-1 px-2 py-2 text-sm focus:outline-none w-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length < 3 && (
        <button onClick={addItem} className="text-blue-600 text-sm hover:underline mb-4">
          + Add another item
        </button>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving items..." : "Save & Continue →"}
      </button>
    </div>
  );
}

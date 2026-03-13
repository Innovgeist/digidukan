"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/components/owner/ImageUpload";
import {
  createCollectionAction,
  updateCollectionAction,
  deleteCollectionAction,
} from "@/lib/actions/collection";

type CollectionType = "SEASONAL" | "OCCASION" | "FEATURED" | "CUSTOM";

interface Collection {
  id: string;
  name: string;
  type: CollectionType;
  description: string;
  coverUrl: string;
  coverPublicId: string;
  displayOrder: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  itemCount: number;
}

interface Props {
  shopId: string;
  collections: Collection[];
  limitReached: boolean;
  limit: number;
}

const TYPE_BADGE: Record<CollectionType, string> = {
  SEASONAL: "bg-blue-100 text-blue-700",
  OCCASION: "bg-purple-100 text-purple-700",
  FEATURED: "bg-amber-100 text-amber-700",
  CUSTOM: "bg-gray-100 text-gray-600",
};

const EMPTY_FORM = {
  name: "",
  type: "CUSTOM" as CollectionType,
  description: "",
  coverUrl: "",
  coverPublicId: "",
  displayOrder: 0,
  isActive: true,
  startsAt: "",
  endsAt: "",
};

export function CollectionManager({ shopId, collections: initial, limitReached }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setShowForm(true);
  }

  function openEdit(col: Collection) {
    setFormData({
      name: col.name,
      type: col.type,
      description: col.description,
      coverUrl: col.coverUrl,
      coverPublicId: col.coverPublicId,
      displayOrder: col.displayOrder,
      isActive: col.isActive,
      startsAt: col.startsAt ? col.startsAt.slice(0, 10) : "",
      endsAt: col.endsAt ? col.endsAt.slice(0, 10) : "",
    });
    setEditingId(col.id);
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError(null);
  }

  function setField<K extends keyof typeof EMPTY_FORM>(key: K, value: typeof EMPTY_FORM[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder),
    };

    if (editingId) {
      const result = await updateCollectionAction(editingId, payload);
      if (result.error) { setError(result.error); setLoading(false); return; }
    } else {
      const result = await createCollectionAction(shopId, payload);
      if (result.error) { setError(result.error); setLoading(false); return; }
    }

    toast.success("Collection saved!");
    setLoading(false);
    closeForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this collection? Items in the collection will not be deleted.")) return;
    setLoading(true);
    const result = await deleteCollectionAction(id);
    if (result.success) { toast.success("Collection deleted"); router.refresh(); }
    else { toast.error("Failed to delete collection"); setError("Failed to delete collection"); }
    setLoading(false);
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-xs text-red-400 hover:underline mt-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Collection list */}
      {initial.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center mb-4">
          <p className="text-gray-500 text-sm">No collections yet. Create one to group your items.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {initial.map((col) => (
            <div key={col.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {col.coverUrl && (
                  <img
                    src={col.coverUrl}
                    alt={col.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{col.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[col.type]}`}>
                      {col.type}
                    </span>
                    {!col.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        inactive
                      </span>
                    )}
                  </div>
                  {col.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{col.description}</p>
                  )}
                  <a
                    href={`/shops/${shopId}/collections/${col.id}`}
                    className="text-xs text-blue-500 hover:underline mt-0.5 inline-block"
                  >
                    {col.itemCount} item{col.itemCount !== 1 ? "s" : ""} &rarr; Manage items
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(col)}
                  className="text-xs text-blue-600 hover:underline border border-blue-200 rounded px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
                  disabled={loading}
                  className="text-xs text-red-500 hover:underline border border-red-200 rounded px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {limitReached ? (
        <div
          title="Collection limit reached — upgrade your plan to add more"
          className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 text-center text-sm text-gray-400 cursor-not-allowed"
        >
          Collection limit reached — upgrade to add more
        </div>
      ) : (
        <button
          onClick={openCreate}
          className="w-full border-2 border-dashed border-gray-300 text-gray-500 rounded-xl py-3 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + New Collection
        </button>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl my-8">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              {editingId ? "Edit Collection" : "New Collection"}
            </h3>

            <div className="space-y-4 mb-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Summer Sale"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setField("type", e.target.value as CollectionType)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CUSTOM">Custom</option>
                  <option value="SEASONAL">Seasonal</option>
                  <option value="OCCASION">Occasion</option>
                  <option value="FEATURED">Featured</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Brief description of this collection"
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (optional)</label>
                <ImageUpload
                  folder="collections"
                  value={formData.coverUrl}
                  onChange={(url, publicId) => {
                    setField("coverUrl", url);
                    setField("coverPublicId", publicId);
                  }}
                  label="Upload Cover"
                  aspectHint="Recommended: 16:9 or square"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={(e) => setField("displayOrder", parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starts At (optional)</label>
                  <input
                    type="date"
                    value={formData.startsAt}
                    onChange={(e) => setField("startsAt", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ends At (optional)</label>
                  <input
                    type="date"
                    value={formData.endsAt}
                    onChange={(e) => setField("endsAt", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="col-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="col-isActive" className="text-sm font-medium text-gray-700">
                  Active (visible on shop)
                </label>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeForm}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

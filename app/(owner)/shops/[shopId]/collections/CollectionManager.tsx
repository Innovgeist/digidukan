"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Layers, X, ArrowRight } from "lucide-react";
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
  SEASONAL: "bg-primary-container/20 text-primary",
  OCCASION: "bg-tertiary-fixed-dim/30 text-tertiary",
  FEATURED: "bg-secondary-container/40 text-secondary",
  CUSTOM: "bg-surface-container-high text-on-surface-variant",
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

  function setField<K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: typeof EMPTY_FORM[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    const payload = { ...formData, displayOrder: Number(formData.displayOrder) };

    if (editingId) {
      const result = await updateCollectionAction(editingId, payload);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } else {
      const result = await createCollectionAction(shopId, payload);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    }

    toast.success("Collection saved!");
    setLoading(false);
    closeForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (
      !confirm("Delete this collection? Items in the collection will not be deleted.")
    )
      return;
    setLoading(true);
    const result = await deleteCollectionAction(id);
    if (result.success) {
      toast.success("Collection deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete collection");
      setError("Failed to delete collection");
    }
    setLoading(false);
  }

  return (
    <div>
      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg p-3 mb-6 flex items-start justify-between gap-2">
          <p className="text-on-error-container text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* List */}
      {initial.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-stitch-1 p-12 text-center mb-6">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-primary mb-4 mx-auto">
            <Layers className="w-7 h-7" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-on-surface mb-2">
            No collections yet
          </h3>
          <p className="text-base text-on-surface-variant max-w-md mx-auto">
            Create one to group your items.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {initial.map((col) => (
            <div
              key={col.id}
              className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-stitch-1 hover:shadow-stitch-2 hover:border-primary-fixed-dim transition-all duration-200 overflow-hidden flex flex-col ${
                !col.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="aspect-[16/9] bg-surface-container relative">
                {col.coverUrl ? (
                  <Image
                    src={col.coverUrl}
                    alt={col.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-12 h-12 text-outline" strokeWidth={1.5} />
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 rounded-full font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wide ${TYPE_BADGE[col.type]}`}
                >
                  {col.type}
                </span>
                {!col.isActive && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[12px] font-semibold">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-on-surface mb-1">
                  {col.name}
                </h3>
                {col.description && (
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">
                    {col.description}
                  </p>
                )}
                <Link
                  href={`/shops/${shopId}/collections/${col.id}`}
                  className="text-sm text-primary hover:underline font-medium font-[family-name:var(--font-inter)] inline-flex items-center gap-1 mb-3"
                >
                  {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
                </Link>
                <div className="mt-auto flex items-center gap-2 pt-3 border-t border-outline-variant/30 font-[family-name:var(--font-inter)]">
                  <button
                    onClick={() => openEdit(col)}
                    className="flex-1 px-3 py-2 border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={2} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
                    disabled={loading}
                    className="px-3 py-2 border border-error/20 text-error rounded-lg hover:bg-error-container/40 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New collection */}
      {limitReached ? (
        <div className="w-full border border-outline-variant/30 bg-surface-container-low rounded-xl py-3 text-center text-sm text-on-surface-variant cursor-not-allowed">
          Collection limit reached — upgrade to add more
        </div>
      ) : (
        <button
          onClick={openCreate}
          className="w-full border-2 border-dashed border-outline-variant text-on-surface-variant rounded-xl py-3 text-sm font-medium font-[family-name:var(--font-inter)] hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          New Collection
        </button>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-lg shadow-stitch-2 my-8 font-[family-name:var(--font-jakarta)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-on-surface">
                {editingId ? "Edit Collection" : "New Collection"}
              </h3>
              <button
                onClick={closeForm}
                className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <Field label="Name *">
                <input
                  value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="modal-input"
                  placeholder="e.g. Summer Sale"
                />
              </Field>
              <Field label="Type">
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setField("type", e.target.value as CollectionType)
                  }
                  className="modal-input cursor-pointer"
                >
                  <option value="CUSTOM">Custom</option>
                  <option value="SEASONAL">Seasonal</option>
                  <option value="OCCASION">Occasion</option>
                  <option value="FEATURED">Featured</option>
                </select>
              </Field>
              <Field label="Description (optional)">
                <textarea
                  value={formData.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="modal-input resize-y"
                  rows={2}
                  placeholder="Brief description of this collection"
                />
              </Field>
              <Field label="Cover Image (optional)">
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
              </Field>
              <Field label="Display Order">
                <input
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setField("displayOrder", parseInt(e.target.value) || 0)
                  }
                  className="modal-input"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Starts At (optional)">
                  <input
                    type="date"
                    value={formData.startsAt}
                    onChange={(e) => setField("startsAt", e.target.value)}
                    className="modal-input"
                  />
                </Field>
                <Field label="Ends At (optional)">
                  <input
                    type="date"
                    value={formData.endsAt}
                    onChange={(e) => setField("endsAt", e.target.value)}
                    className="modal-input"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-on-surface">
                  Active (visible on storefront)
                </span>
              </label>

              {error && <p className="text-error text-xs">{error}</p>}
            </div>

            <div className="flex gap-3 font-[family-name:var(--font-inter)]">
              <button
                onClick={closeForm}
                className="flex-1 border border-primary text-primary h-12 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-primary text-on-primary h-12 rounded-lg text-sm font-medium hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>

            <style jsx>{`
              :global(.modal-input) {
                width: 100%;
                padding: 10px 14px;
                border: 1px solid var(--color-outline-variant);
                border-radius: 0.5rem;
                background-color: var(--color-surface-container-lowest);
                color: var(--color-on-surface);
                font-size: 16px;
                line-height: 1.5;
                transition: all 200ms ease;
                font-family: var(--font-jakarta);
              }
              :global(.modal-input:focus) {
                outline: none;
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px rgba(0, 74, 198, 0.2);
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}

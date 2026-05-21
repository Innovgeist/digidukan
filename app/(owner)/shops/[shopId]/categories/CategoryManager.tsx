"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, FolderOpen, GripVertical, X } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/category";

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  itemCount: number;
}

interface Props {
  shopId: string;
  categories: Category[];
  canAdd: boolean;
  limit: number;
  current: number;
}

export function CategoryManager({ shopId, categories: initial, canAdd }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickName, setQuickName] = useState("");

  function openEdit(cat: Category) {
    setFormData({ name: cat.name, description: cat.description });
    setEditingId(cat.id);
    setShowForm(true);
    setError(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError(null);
  }

  async function handleQuickAdd() {
    if (!quickName.trim() || !canAdd) return;
    setLoading(true);
    setError(null);
    const result = await createCategoryAction(shopId, {
      name: quickName.trim(),
      description: "",
    });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setQuickName("");
    setLoading(false);
    router.refresh();
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (editingId) {
      const result = await updateCategoryAction(editingId, formData);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } else {
      const result = await createCategoryAction(shopId, formData);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    closeForm();
    router.refresh();
  }

  async function handleDelete(id: string, itemCount: number) {
    if (itemCount > 0) {
      setError(`Cannot delete: ${itemCount} item(s) use this category.`);
      return;
    }
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    const result = await deleteCategoryAction(id);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  async function handleToggle(cat: Category) {
    await updateCategoryAction(cat.id, { isActive: !cat.isActive });
    router.refresh();
  }

  return (
    <div>
      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg p-3 mb-6 flex items-start justify-between gap-2">
          <p className="text-on-error-container text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-on-error-container hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick-add row */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-stitch-1 mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
        <div className="flex-1 flex flex-col gap-2">
          <label
            htmlFor="quick-add"
            className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant"
          >
            New Category Name
          </label>
          <input
            id="quick-add"
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuickAdd();
            }}
            disabled={!canAdd || loading}
            placeholder="e.g. Summer Collection, Electronics"
            className="w-full h-12 px-4 border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface-container-lowest text-on-surface placeholder:text-outline disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleQuickAdd}
          disabled={!canAdd || loading || !quickName.trim()}
          className="h-12 px-6 bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-lg font-[family-name:var(--font-inter)] text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
        >
          <Plus className="w-5 h-5" strokeWidth={2.4} />
          Add Category
        </button>
      </div>

      {/* List */}
      {initial.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-stitch-1 p-12 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-primary mb-4 mx-auto">
            <FolderOpen className="w-7 h-7" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-on-surface mb-2">
            No categories yet
          </h3>
          <p className="text-base text-on-surface-variant max-w-md mx-auto">
            Create your first category above to start organizing your shop&apos;s
            inventory.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-stitch-1 overflow-hidden">
          {/* Header (desktop) */}
          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center p-4 border-b border-outline-variant/40 bg-surface-container-low font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            <div className="w-8" />
            <div>Category Name</div>
            <div className="w-24 text-right">Items</div>
            <div className="w-24 text-center">Status</div>
            <div className="w-24 text-right">Actions</div>
          </div>

          {/* Body */}
          <div className="flex flex-col">
            {initial.map((cat, idx) => (
              <div
                key={cat.id}
                className={`group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center p-4 border-b border-outline-variant/40 last:border-0 hover:bg-surface-container-low transition-colors ${
                  idx % 2 === 1 ? "bg-[#F1F5F9]/40" : ""
                } ${!cat.isActive ? "opacity-60" : ""}`}
              >
                <div className="text-outline cursor-grab w-8 flex justify-center">
                  <GripVertical className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-on-surface truncate">
                    {cat.name}
                  </span>
                  {cat.description && (
                    <span className="text-xs text-on-surface-variant mt-0.5 truncate">
                      {cat.description}
                    </span>
                  )}
                  <span className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant sm:hidden mt-1">
                    {cat.itemCount} {cat.itemCount === 1 ? "Item" : "Items"} ·{" "}
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="hidden sm:block w-24 text-right font-[family-name:var(--font-inter)] text-sm text-on-surface-variant">
                  {cat.itemCount}
                </div>
                <div className="w-auto sm:w-24 flex justify-end sm:justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cat.isActive}
                      onChange={() => handleToggle(cat)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </label>
                </div>
                <div className="hidden sm:flex w-24 justify-end gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    title="Edit"
                    className="p-2 text-outline hover:text-primary rounded-md hover:bg-primary-fixed-dim/20 transition-colors"
                  >
                    <Pencil className="w-5 h-5" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.itemCount)}
                    disabled={cat.itemCount > 0}
                    title={
                      cat.itemCount > 0
                        ? "Remove all items first"
                        : "Delete category"
                    }
                    className="p-2 text-outline hover:text-error rounded-md hover:bg-error-container/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
                <button
                  onClick={() => openEdit(cat)}
                  className="sm:hidden p-2 text-outline hover:text-on-surface"
                  aria-label="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-md shadow-stitch-2 font-[family-name:var(--font-jakarta)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-on-surface">
                Edit Category
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
              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                  Name *
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full h-12 px-4 border border-outline-variant rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. Sweets"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
                  rows={2}
                  placeholder="Brief description"
                />
              </div>
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
          </div>
        </div>
      )}
    </div>
  );
}

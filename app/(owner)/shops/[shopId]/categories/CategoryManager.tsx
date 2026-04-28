"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/category";

interface Category {
  id: string; name: string; description: string;
  isActive: boolean; displayOrder: number; itemCount: number;
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
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() { setFormData({ name: "", description: "" }); setEditingId(null); setShowForm(true); setError(null); }
  function openEdit(cat: Category) { setFormData({ name: cat.name, description: cat.description }); setEditingId(cat.id); setShowForm(true); setError(null); }
  function closeForm() { setShowForm(false); setEditingId(null); setError(null); }

  async function handleSave() {
    setLoading(true); setError(null);
    if (!formData.name.trim()) { setError("Name is required"); setLoading(false); return; }

    if (editingId) {
      const result = await updateCategoryAction(editingId, formData);
      if (result.error) { setError(result.error); setLoading(false); return; }
    } else {
      const result = await createCategoryAction(shopId, formData);
      if (result.error) { setError(result.error); setLoading(false); return; }
    }
    setLoading(false);
    closeForm();
    router.refresh();
  }

  async function handleDelete(id: string, itemCount: number) {
    if (itemCount > 0) { setError(`Cannot delete: ${itemCount} item(s) use this category.`); return; }
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    const result = await deleteCategoryAction(id);
    if (result.error) { setError(result.error); } else { router.refresh(); }
    setLoading(false);
  }

  async function handleToggle(cat: Category) {
    await updateCategoryAction(cat.id, { isActive: !cat.isActive });
    router.refresh();
  }

  return (
    <div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"><p className="text-red-600 text-sm">{error}</p><button onClick={() => setError(null)} className="text-xs text-red-400 hover:underline mt-1">Dismiss</button></div>}

      {/* Category list */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center mb-4">
          <p className="text-gray-500 text-sm">No categories yet. Add one to start organising your items.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                  {!cat.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">inactive</span>}
                </div>
                {cat.description && <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{cat.itemCount} item{cat.itemCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(cat)} className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-1">
                  {cat.isActive ? "Hide" : "Show"}
                </button>
                <button onClick={() => openEdit(cat)} className="text-xs text-blue-600 hover:underline border border-blue-200 rounded px-2 py-1">
                  Edit
                </button>
                <button onClick={() => handleDelete(cat.id, cat.itemCount)} disabled={cat.itemCount > 0} className="text-xs text-red-500 hover:underline border border-red-200 rounded px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed" title={cat.itemCount > 0 ? "Remove all items first" : "Delete category"}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {canAdd ? (
        <button onClick={openCreate} className="w-full border-2 border-dashed border-gray-300 text-gray-500 rounded-xl py-3 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors">
          + Add Category
        </button>
      ) : (
        <div className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 text-center text-sm text-gray-400">
          Category limit reached — upgrade to add more
        </div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-4">{editingId ? "Edit Category" : "New Category"}</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sweets" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Brief description" />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={closeForm} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

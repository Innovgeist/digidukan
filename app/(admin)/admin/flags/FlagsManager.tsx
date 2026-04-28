"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createFlagAction,
  toggleFlagAction,
  deleteFlagAction,
  type FeatureFlag,
} from "@/lib/actions/admin-flags";

interface FlagsManagerProps {
  flags: FeatureFlag[];
}

export function FlagsManager({ flags: initialFlags }: FlagsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // New flag form state
  const [newKey, setNewKey] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newEnabled, setNewEnabled] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Per-flag action states
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  function setFlagLoading(id: string, loading: boolean) {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (loading) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleToggle(flagId: string) {
    if (loadingIds.has(flagId)) return;
    setFlagLoading(flagId, true);
    try {
      const result = await toggleFlagAction(flagId);
      if ("error" in result) {
        alert(result.error);
      } else {
        startTransition(() => router.refresh());
      }
    } finally {
      setFlagLoading(flagId, false);
    }
  }

  async function handleDelete(flagId: string, flagKey: string) {
    if (!confirm(`Delete flag "${flagKey}"? This cannot be undone.`)) return;
    if (loadingIds.has(flagId)) return;
    setFlagLoading(flagId, true);
    try {
      const result = await deleteFlagAction(flagId);
      if ("error" in result) {
        alert(result.error);
      } else {
        startTransition(() => router.refresh());
      }
    } finally {
      setFlagLoading(flagId, false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!newKey.trim()) {
      setFormError("Flag key is required.");
      return;
    }

    setFormLoading(true);
    try {
      const result = await createFlagAction({
        key: newKey.trim(),
        description: newDescription.trim() || undefined,
        isEnabled: newEnabled,
      });

      if ("error" in result) {
        setFormError(result.error);
      } else {
        setNewKey("");
        setNewDescription("");
        setNewEnabled(false);
        startTransition(() => router.refresh());
      }
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* New Flag Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Feature Flag</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flag Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. new_dashboard_ui"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formLoading}
              />
              <p className="text-xs text-gray-400 mt-1">
                Spaces will be replaced with underscores, lowercased.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formLoading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="newEnabled"
              checked={newEnabled}
              onChange={(e) => setNewEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={formLoading}
            />
            <label htmlFor="newEnabled" className="text-sm text-gray-700">
              Enable immediately
            </label>
          </div>

          {formError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formLoading ? "Creating…" : "Create Flag"}
          </button>
        </form>
      </div>

      {/* Flags List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Feature Flags{" "}
            <span className="text-sm font-normal text-gray-500">
              ({initialFlags.length})
            </span>
          </h2>
        </div>

        {initialFlags.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No feature flags defined yet. Create one above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {initialFlags.map((flag) => {
              const isLoading = loadingIds.has(flag.id);
              return (
                <li
                  key={flag.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {flag.key}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          flag.isEnabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {flag.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    {flag.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {flag.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Created {new Date(flag.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(flag.id)}
                      disabled={isLoading || isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 ${
                        flag.isEnabled ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-label={`${flag.isEnabled ? "Disable" : "Enable"} flag ${flag.key}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          flag.isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(flag.id, flag.key)}
                      disabled={isLoading || isPending}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      aria-label={`Delete flag ${flag.key}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

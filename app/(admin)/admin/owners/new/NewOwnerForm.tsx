"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOwnerAction } from "@/lib/actions/admin-owner";

export function NewOwnerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function generatePassword() {
    return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const result = await createOwnerAction({ name, email, password });
    if (result.error) { setError(result.error); setLoading(false); return; }
    router.push(`/admin/owners/${result.userId}`);
  }

  const ic = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={ic} placeholder="e.g. Rahul Sharma" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={ic} placeholder="owner@example.com" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
        <div className="flex gap-2">
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={`${ic} flex-1`} required />
          <button type="button" onClick={() => setPassword(generatePassword())} className="text-xs border border-gray-300 rounded-lg px-2 py-1 hover:bg-gray-50 flex-shrink-0">
            Generate
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Share this password with the owner. They can change it later.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Creating..." : "Create Owner Account"}
      </button>
    </form>
  );
}

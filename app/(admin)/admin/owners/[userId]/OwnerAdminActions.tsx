"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { suspendOwnerAction } from "@/lib/actions/admin-owner";

interface Props { ownerId: string; ownerName: string; }

export function OwnerAdminActions({ ownerId, ownerName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "error" | "success"; msg: string } | null>(null);

  async function handleSuspend() {
    if (!confirm(`Suspend all shops for "${ownerName}"? Their storefronts will be taken offline.`)) return;
    setLoading(true); setResult(null);
    const r = await suspendOwnerAction(ownerId);
    if (r.error) { setResult({ type: "error", msg: r.error }); toast.error(r.error); }
    else { setResult({ type: "success", msg: "All shops suspended." }); toast.success("All shops suspended"); router.refresh(); }
    setLoading(false);
  }

  async function handleImpersonate() {
    const reason = prompt("Reason for impersonation (required):");
    if (!reason?.trim()) return;
    const res = await fetch("/api/admin/impersonation/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: ownerId, reason }),
    });
    if (res.ok) {
      toast.success("Impersonation started — redirecting...");
      window.location.href = "/dashboard";
    } else {
      toast.error("Failed to start impersonation.");
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h2 className="font-semibold text-gray-900">Admin Actions</h2>
      {result && (
        <div className={`rounded-lg p-3 text-sm ${result.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {result.msg}
        </div>
      )}
      <button
        onClick={handleImpersonate}
        className="w-full border border-blue-300 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
      >
        Impersonate Owner
      </button>
      <button
        onClick={handleSuspend}
        disabled={loading}
        className="w-full border border-red-300 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? "..." : "Suspend All Shops"}
      </button>
    </div>
  );
}

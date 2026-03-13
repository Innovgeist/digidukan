"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  grantTrialAction,
  suspendShopAction,
  unsuspendShopAction,
  archiveShopAction,
  publishShopAction,
  assignPlanAction,
} from "@/lib/actions/admin";

interface Plan {
  id: string;
  name: string;
  planType: string;
}

interface Props {
  shopId: string;
  shopStatus: string;
  shopName: string;
  currentPlanName: string;
  plans: Plan[];
  currentPlanId?: string;
}

export function AdminShopActions({
  shopId,
  shopStatus,
  shopName,
  currentPlanName,
  plans,
  currentPlanId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Grant trial form state
  const [durationDays, setDurationDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [showTrialForm, setShowTrialForm] = useState(false);

  // Assign plan state
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId ?? "");

  async function handleGrantTrial(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    const result = await grantTrialAction(shopId, { durationDays, notes });
    if (result.error) { setError(result.error); toast.error(result.error); }
    else { setSuccess(`${durationDays}-day trial granted successfully!`); toast.success("Trial granted successfully"); setShowTrialForm(false); router.refresh(); }
    setLoading(false);
  }

  async function handleSuspend() {
    if (!confirm(`Suspend "${shopName}"? The storefront will become inaccessible.`)) return;
    setLoading(true); setError(null); setSuccess(null);
    const result = await suspendShopAction(shopId);
    if (result.error) { setError(result.error); toast.error(result.error || "Action failed"); }
    else { setSuccess("Shop suspended."); toast.success("Shop suspended"); router.refresh(); }
    setLoading(false);
  }

  async function handleUnsuspend() {
    setLoading(true); setError(null); setSuccess(null);
    const result = await unsuspendShopAction(shopId);
    if (result.error) { setError(result.error); toast.error(result.error || "Action failed"); }
    else { setSuccess("Shop unsuspended (returned to Draft)."); toast.success("Shop unsuspended"); router.refresh(); }
    setLoading(false);
  }

  async function handleArchive() {
    if (!confirm(`Archive "${shopName}"? This will make the shop inactive.`)) return;
    setLoading(true); setError(null); setSuccess(null);
    const result = await archiveShopAction(shopId);
    if (result.error) { setError(result.error); toast.error(result.error || "Action failed"); }
    else { setSuccess("Shop archived."); toast.success("Shop archived"); router.refresh(); }
    setLoading(false);
  }

  async function handlePublish() {
    if (!confirm(`Publish/activate "${shopName}"? The storefront will become publicly accessible.`)) return;
    setLoading(true); setError(null); setSuccess(null);
    const result = await publishShopAction(shopId);
    if (result.error) { setError(result.error); toast.error(result.error || "Action failed"); }
    else { setSuccess("Shop published and set to active."); toast.success("Shop published"); router.refresh(); }
    setLoading(false);
  }

  async function handleAssignPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlanId) { setError("Please select a plan."); return; }
    setLoading(true); setError(null); setSuccess(null);
    const result = await assignPlanAction(shopId, selectedPlanId);
    if (result.error) { setError(result.error); toast.error(result.error || "Action failed"); }
    else { setSuccess("Plan assigned successfully."); toast.success("Plan assigned"); router.refresh(); }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm">{success}</div>}

      {/* Grant trial */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-gray-900">Grant Trial</h2>
            <p className="text-xs text-gray-500">Current: {currentPlanName}</p>
          </div>
          <button
            onClick={() => setShowTrialForm(!showTrialForm)}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
          >
            {showTrialForm ? "Cancel" : "Grant Trial"}
          </button>
        </div>

        {showTrialForm && (
          <form onSubmit={handleGrantTrial} className="space-y-3 border-t border-gray-100 pt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days (1 month)</option>
                <option value={60}>60 days (2 months)</option>
                <option value={90}>90 days (3 months)</option>
                <option value={365}>365 days (1 year)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Onboarding support, referral reward"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Granting..." : `Grant ${durationDays}-Day Trial`}
            </button>
          </form>
        )}
      </div>

      {/* Assign Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Assign Plan</h2>
        <form onSubmit={handleAssignPlan} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">-- Choose a plan --</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} ({plan.planType})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || !selectedPlanId}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign Plan"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Assigning a plan sets a permanent subscription (no expiry) for this shop.
        </p>
      </div>

      {/* Shop Status Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Shop Status</h2>
        <div className="space-y-2">
          {shopStatus !== "PUBLISHED" && (
            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "..." : "Publish / Activate Shop"}
            </button>
          )}

          {shopStatus === "SUSPENDED" ? (
            <button
              onClick={handleUnsuspend}
              disabled={loading}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
            >
              {loading ? "..." : "Unsuspend Shop"}
            </button>
          ) : (
            <button
              onClick={handleSuspend}
              disabled={loading || shopStatus === "ARCHIVED"}
              className="w-full border border-red-300 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-40"
            >
              {loading ? "..." : "Suspend Shop"}
            </button>
          )}

          {shopStatus !== "ARCHIVED" && (
            <button
              onClick={handleArchive}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
            >
              {loading ? "..." : "Archive Shop"}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Suspending makes the public storefront show a &quot;suspended&quot; message. Archiving deactivates the shop permanently.
        </p>
      </div>
    </div>
  );
}

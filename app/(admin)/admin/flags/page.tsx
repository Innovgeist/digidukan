import { getAllFlagsAction } from "@/lib/actions/admin-flags";
import { FlagsManager } from "./FlagsManager";

export default async function AdminFlagsPage() {
  // getAllFlagsAction reads from the JSON file and verifies admin session
  let flags: Awaited<ReturnType<typeof getAllFlagsAction>>;
  try {
    flags = await getAllFlagsAction();
  } catch {
    // FORBIDDEN or file read error
    flags = [];
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feature Flags</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage application-wide feature flags. Changes take effect immediately on
          next request.
        </p>
        <div className="mt-2 inline-block px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
          Flags are stored in <code className="font-mono">/data/feature-flags.json</code>{" "}
          (no database schema required).
        </div>
      </div>

      <FlagsManager flags={flags} />
    </div>
  );
}

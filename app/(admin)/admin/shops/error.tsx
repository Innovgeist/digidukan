"use client";

import Link from "next/link";

export default function AdminShopsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Something went wrong
        </h2>
        <pre className="text-xs text-gray-500 font-mono bg-gray-50 rounded-lg p-3 mb-6 text-left overflow-auto whitespace-pre-wrap break-all">
          {error.message}
        </pre>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}

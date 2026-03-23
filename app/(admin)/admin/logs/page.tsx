import { prisma } from "@/lib/db";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const searchTerm = search?.trim() ?? "";

  const logs = await prisma.adminActionLog.findMany({
    where:
      searchTerm
        ? {
            OR: [
              { action: { contains: searchTerm, mode: "insensitive" } },
              { targetType: { contains: searchTerm, mode: "insensitive" } },
              { targetId: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      admin: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Action Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last 100 admin actions
            {searchTerm ? ` matching "${searchTerm}"` : ""}
          </p>
        </div>
        <Link
          href="/admin/logs/impersonation"
          className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Impersonation Logs
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Search by action, target type, or target ID…"
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          {searchTerm && (
            <Link
              href="/admin/logs"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {searchTerm ? "No logs match your search." : "No admin action logs yet."}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Target Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Target ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Metadata
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {log.admin.name ?? "—"}
                      </div>
                      <div className="text-xs text-gray-500">{log.admin.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.targetType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 truncate max-w-[120px]">
                      {log.targetId}
                    </td>
                    <td className="px-4 py-3">
                      {log.metadata ? (
                        <details className="cursor-pointer">
                          <summary className="text-xs text-blue-600 hover:underline select-none">
                            View
                          </summary>
                          <pre className="mt-1 text-xs bg-gray-100 rounded p-2 max-w-xs overflow-x-auto whitespace-pre-wrap break-all">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            Showing {logs.length} record{logs.length !== 1 ? "s" : ""}
            {searchTerm ? ` for "${searchTerm}"` : " (most recent 100)"}
          </div>
        </div>
      )}
    </div>
  );
}

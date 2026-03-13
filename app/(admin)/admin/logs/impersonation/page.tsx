import { prisma } from "@/lib/db";
import Link from "next/link";

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

function formatDuration(startedAt: Date, endedAt: Date | null): string {
  if (!endedAt) return "Active";

  const diffMs = endedAt.getTime() - startedAt.getTime();
  if (diffMs < 0) return "—";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default async function ImpersonationLogsPage() {
  // Schema: SupportImpersonationLog
  // Relations: admin (User via "AdminUser"), targetOwner (User via "TargetOwner")
  // Fields: id, adminId, targetOwnerId, reason, startedAt, endedAt, isActive
  const logs = await prisma.supportImpersonationLog.findMany({
    orderBy: { startedAt: "desc" },
    include: {
      admin: {
        select: { name: true, email: true },
      },
      targetOwner: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impersonation Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            All admin impersonation sessions ({logs.length} total)
          </p>
        </div>
        <Link
          href="/admin/logs"
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Action Logs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active Now</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {logs.filter((l) => l.isActive && !l.endedAt).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {logs.filter((l) => !!l.endedAt).length}
          </p>
        </div>
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No impersonation sessions recorded yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                    Started At
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Impersonated User
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => {
                  const isActive = log.isActive && !log.endedAt;
                  const duration = formatDuration(log.startedAt, log.endedAt);

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(log.startedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {log.admin.name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">{log.admin.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {log.targetOwner.name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">{log.targetOwner.email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {isActive ? (
                          <span className="text-amber-600 font-medium">Active</span>
                        ) : (
                          duration
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isActive ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Ended
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">
                        {log.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            {logs.length} session{logs.length !== 1 ? "s" : ""} total
          </div>
        </div>
      )}
    </div>
  );
}

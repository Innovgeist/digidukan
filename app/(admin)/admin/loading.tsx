import { AnalyticsCardSkeleton, TableRowSkeleton } from "@/components/shared/LoadingSkeleton";

export default function AdminLoading() {
  return (
    <div className="p-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-44 mb-6" />

      {/* Analytics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <AnalyticsCardSkeleton />
        <AnalyticsCardSkeleton />
        <AnalyticsCardSkeleton />
        <AnalyticsCardSkeleton />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50 animate-pulse">
          <div className="h-3 bg-gray-200 rounded flex-1" />
          <div className="h-3 bg-gray-200 rounded flex-1" />
          <div className="h-3 bg-gray-200 rounded flex-1" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}

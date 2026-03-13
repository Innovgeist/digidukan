import { TableRowSkeleton } from "@/components/shared/LoadingSkeleton";

export default function CategoriesLoading() {
  return (
    <div className="p-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-40 mb-6" />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header skeleton */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="h-3 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-3 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-3 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
        </div>
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}

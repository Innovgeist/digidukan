import { SkeletonLine } from "@/components/shared/LoadingSkeleton";

export default function ShopDetailLoading() {
  return (
    <div className="p-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="mb-6">
        <div className="h-7 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-72" />
      </div>

      {/* 4 action cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-6 bg-gray-200 rounded w-8 mb-3" />
            <SkeletonLine className="w-1/2 mb-2" />
            <SkeletonLine className="w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

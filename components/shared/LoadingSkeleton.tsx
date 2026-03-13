export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={`h-4 bg-gray-200 rounded animate-pulse ${className ?? ""}`} />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className ?? ""}`}>
      <SkeletonLine className="w-3/4 mb-3" />
      <SkeletonLine className="w-1/2 mb-2" />
      <SkeletonLine className="w-2/3" />
    </div>
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image area */}
      <div className="h-36 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Square image */}
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        {/* Button placeholder */}
        <div className="h-8 bg-gray-200 rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded flex-1" />
      <div className="h-4 bg-gray-200 rounded flex-1" />
      <div className="h-4 bg-gray-200 rounded flex-1" />
      <div className="h-4 bg-gray-200 rounded w-20" />
    </div>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      {/* Large number */}
      <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
      {/* Label */}
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  );
}

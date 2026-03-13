import { ShopCardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function ShopsLoading() {
  return (
    <div className="p-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-40 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ShopCardSkeleton />
        <ShopCardSkeleton />
        <ShopCardSkeleton />
      </div>
    </div>
  );
}

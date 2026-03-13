import { ItemCardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function ItemsLoading() {
  return (
    <div className="p-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
      </div>
    </div>
  );
}

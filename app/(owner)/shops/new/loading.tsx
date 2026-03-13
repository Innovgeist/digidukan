import { SkeletonLine } from "@/components/shared/LoadingSkeleton";

export default function NewShopLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-40 mb-6" />
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl space-y-5">
        <div>
          <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
          <SkeletonLine className="h-9 w-full" />
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-32 mb-2" />
          <SkeletonLine className="h-9 w-full" />
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-28 mb-2" />
          <SkeletonLine className="h-20 w-full" />
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
          <SkeletonLine className="h-9 w-full" />
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-28 mt-2" />
      </div>
    </div>
  );
}

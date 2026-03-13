export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Cover skeleton */}
      <div className="h-40 bg-gray-200" />
      {/* Logo circle */}
      <div className="px-4 pb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full -mt-8 mb-3 border-2 border-white" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      {/* Action buttons */}
      <div className="flex gap-3 px-4 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-xl flex-1" />
        ))}
      </div>
      {/* Items */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

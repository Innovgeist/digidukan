import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Shop not found
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          The shop you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link
          href="/shops"
          className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Shops
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function StorefrontNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center bg-gray-50">
      <div>
        <p className="text-5xl mb-4">🏪</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Shop Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          This shop doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          Go to DigiDukan →
        </Link>
      </div>
    </div>
  );
}

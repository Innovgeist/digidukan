import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">DigiDukan</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Create your digital storefront, share via QR code, and let customers
        order directly on WhatsApp.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Get Started Free
        </Link>
        <Link
          href="/login"
          className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          Login
        </Link>
      </div>
    </main>
  );
}

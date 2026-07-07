import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-gray-200 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">পেজ পাওয়া যায়নি!</h1>
        <p className="text-gray-500 mb-8">আপনি যে পেজটি খুঁজছেন তা পাওয়া যায়নি অথবা সরিয়ে নেয়া হয়েছে।</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">হোম পেজে ফিরুন</Link>
          <Link href="/shop" className="btn-outline">শপ পেজে যান</Link>
        </div>
      </div>
    </div>
  );
}

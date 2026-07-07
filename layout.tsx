import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayaan Mart BD - আপনার বিশ্বস্ত অনলাইন শপ",
  description: "Ayaan Mart BD - Bangladesh's trusted online shopping destination. Best prices, fast delivery. ইলেকট্রনিক্স, ফ্যাশন, গ্রোসারি সবকিছু এক জায়গায়।",
  keywords: "online shopping, bangladesh, ecommerce, ayaan mart, daraz, electronics, fashion, grocery",
  openGraph: {
    title: "Ayaan Mart BD - আপনার বিশ্বস্ত অনলাইন শপ",
    description: "Bangladesh's trusted online shopping destination with best prices and fast delivery.",
    type: "website",
    locale: "bn_BD",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: "'Inter', 'Hind Siliguri', sans-serif" }}>
        {children}
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/8801700000000?text=Hello%20Ayaan%20Mart%20BD!%20আমি%20আপনাদের%20ওয়েবসাইট%20থেকে%20অর্ডার%20করতে%20চাই।"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          title="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp text-2xl"></i>
        </a>
      </body>
    </html>
  );
}

"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FooterClient() {
  const [settingsObj, setSettingsObj] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettingsObj(d.settings || {}));
  }, []);

  return (
    <footer className="bg-dark text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4"><i className="fas fa-shopping-bag mr-2" style={{ color: "#dc2626" }}></i>Ayaan Mart BD</h3>
            <p className="text-sm text-gray-400 mb-4">{settingsObj.about_text || "আপনার বিশ্বস্ত অনলাইন শপিং ডেস্টিনেশন।"}</p>
            <div className="flex gap-3">
              {settingsObj.facebook_url && <a href={settingsObj.facebook_url} target="_blank" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-colors"><i className="fab fa-facebook-f"></i></a>}
              {settingsObj.instagram_url && <a href={settingsObj.instagram_url} target="_blank" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-colors"><i className="fab fa-instagram"></i></a>}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">কুইক লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/contact" className="hover:text-white">যোগাযোগ</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/shop" className="hover:text-white">সকল পণ্য</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-white">My Account</Link></li>
              <li><Link href="/return-policy" className="hover:text-white">রিটার্ন পলিসি</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/terms" className="hover:text-white">শর্তাবলী</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">যোগাযোগ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><i className="fas fa-map-marker-alt mt-1 text-red-600"></i><span>{settingsObj.contact_address || "Dhaka"}</span></li>
              <li><a href={`tel:${settingsObj.contact_phone}`} className="hover:text-white"><i className="fas fa-phone text-red-600 mr-2"></i>{settingsObj.contact_phone}</a></li>
              <li><a href={`mailto:${settingsObj.contact_email}`} className="hover:text-white"><i className="fas fa-envelope text-red-600 mr-2"></i>{settingsObj.contact_email}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-400 text-center">
          {settingsObj.footer_text || "© 2025 Ayaan Mart BD. সর্বস্বত্ব সংরক্ষিত।"}
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-dark text-gray-300 mt-12">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              <i className="fas fa-shopping-bag mr-2" style={{ color: "#dc2626" }}></i>
              Ayaan Mart BD
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {settings.about_text || "আপনার বিশ্বস্ত অনলাইন শপিং ডেস্টিনেশন। সেরা মানের পণ্য সবচেয়ে কম দামে।"}
            </p>
            <div className="flex gap-3">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              )}
              {settings.whatsapp_number && (
                <a href={`https://wa.me/${settings.whatsapp_number.replace("+", "")}`} target="_blank" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center transition-colors">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">কুইক লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">যোগাযোগ</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ / সাধারণ জিজ্ঞাসা</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">সকল পণ্য</Link></li>
              <li><Link href="/offers" className="hover:text-white transition-colors">অফার ও ডিল</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">রিটার্ন ও রিফান্ড</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">শর্তাবলী</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">যোগাযোগ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt mt-1 text-primary"></i>
                <span>{settings.contact_address || "Dhaka, Bangladesh"}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-primary"></i>
                <a href={`tel:${settings.contact_phone}`} className="hover:text-white">{settings.contact_phone || "+8801700000000"}</a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-primary"></i>
                <a href={`mailto:${settings.contact_email}`} className="hover:text-white">{settings.contact_email || "info@ayaanmartbd.com"}</a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-green-500"></i>
                <a href={`https://wa.me/${(settings.whatsapp_number || "+8801700000000").replace("+", "")}`} target="_blank" className="hover:text-white">WhatsApp</a>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-4">
              <h5 className="text-white text-sm font-medium mb-2">পেমেন্ট মাধ্যম</h5>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white text-dark text-xs px-3 py-1.5 rounded font-bold">COD</span>
                <span className="bg-[#E2136E] text-white text-xs px-3 py-1.5 rounded font-bold">bKash</span>
                <span className="bg-[#F6921E] text-white text-xs px-3 py-1.5 rounded font-bold">Nagad</span>
                <span className="bg-[#8B2F87] text-white text-xs px-3 py-1.5 rounded font-bold">Rocket</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>{settings.footer_text || "© 2025 Ayaan Mart BD. সর্বস্বত্ব সংরক্ষিত।"}</p>
            <p>Designed with ❤️ for Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

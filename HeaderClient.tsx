"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  role: string;
}

export default function HeaderClient() {
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settingsObj, setSettingsObj] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setCurrentUser(d.user));
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettingsObj(d.settings || {}));
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const primaryColor = settingsObj.primary_color || "#dc2626";
  const parentCategories = categories.filter((c: any) => c.parent_id === null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <div className="bg-dark text-gray-300 text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <div className="flex gap-4">
            <a href={`tel:${settingsObj.contact_phone || "+8801700000000"}`} className="hover:text-white"><i className="fas fa-phone text-xs mr-1"></i>{settingsObj.contact_phone || "+8801700000000"}</a>
            <a href={`mailto:${settingsObj.contact_email}`} className="hover:text-white"><i className="fas fa-envelope text-xs mr-1"></i>{settingsObj.contact_email}</a>
          </div>
          <div className="flex gap-3">
            {settingsObj.facebook_url && <a href={settingsObj.facebook_url} target="_blank" className="hover:text-primary"><i className="fab fa-facebook-f"></i></a>}
            {settingsObj.instagram_url && <a href={settingsObj.instagram_url} target="_blank" className="hover:text-primary"><i className="fab fa-instagram"></i></a>}
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                <i className="fas fa-shopping-bag mr-1"></i>
                <span className="hidden sm:inline">Ayaan Mart</span>
              </div>
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded hidden sm:inline">BD</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
              <div className="flex w-full border-2 rounded-lg overflow-hidden" style={{ borderColor: primaryColor }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="পণ্য খুঁজুন..." className="flex-1 px-4 py-2.5 outline-none text-sm" />
                <button type="submit" className="px-6 text-white" style={{ backgroundColor: primaryColor }}><i className="fas fa-search"></i></button>
              </div>
            </form>

            <div className="flex items-center gap-3">
              <Link href="/cart" className="p-2 text-gray-600 hover:text-primary relative">
                <i className="fas fa-shopping-cart text-lg"></i>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
              </Link>
              <div className="relative" ref={dropdownRef}>
                {currentUser ? (
                  <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><i className="fas fa-user text-sm"></i></div>
                    <span className="hidden lg:inline text-sm">{currentUser.name}</span>
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary"><i className="fas fa-user text-lg"></i><span className="hidden lg:inline text-sm">লগইন</span></Link>
                )}
                {userDropdownOpen && currentUser && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 animate-fade-in z-50">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}><i className="fas fa-user-circle mr-2"></i>My Account</Link>
                    <Link href="/account?tab=orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}><i className="fas fa-box mr-2"></i>Orders</Link>
                    {currentUser.role === "admin" && <Link href="/cpanel" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50" onClick={() => setUserDropdownOpen(false)}><i className="fas fa-shield-alt mr-2"></i>Admin</Link>}
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { document.cookie = "token=; path=/; max-age=0"; window.location.reload(); }}><i className="fas fa-sign-out-alt mr-2"></i>Logout</button>
                  </div>
                )}
              </div>
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i></button>
            </div>
          </div>
        </div>

        <nav className="border-t hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-2 py-3 px-4 text-white font-medium text-sm" style={{ backgroundColor: primaryColor }}>
                <i className="fas fa-th"></i>ক্যাটাগরি <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg py-2 hidden group-hover:block z-50 border">
                {parentCategories.map((cat: any) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    {cat.icon && <i className={`fas ${cat.icon} w-5 text-gray-400`}></i>}{cat.name_bn}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/" className="py-3 text-sm font-medium text-gray-700 hover:text-primary">হোম</Link>
            <Link href="/shop" className="py-3 text-sm font-medium text-gray-700 hover:text-primary">সকল পণ্য</Link>
            <Link href="/offers" className="py-3 text-sm font-medium text-primary"><i className="fas fa-fire mr-1"></i>অফার</Link>
            <Link href="/contact" className="py-3 text-sm font-medium text-gray-700 hover:text-primary">যোগাযোগ</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

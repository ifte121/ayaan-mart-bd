"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";

interface HeaderProps {
  categories: { id: number; name_bn: string; name_en: string; slug: string; icon: string | null; parent_id: number | null }[];
  settings: Record<string, string>;
  currentUser: { id: number; name: string; role: string } | null;
}

export default function Header({ categories, settings, currentUser }: HeaderProps) {
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryColor = settings.primary_color || "#dc2626";
  const parentCategories = categories.filter((c) => c.parent_id === null);
  const subCategories = categories.filter((c) => c.parent_id !== null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark text-gray-300 text-sm py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings.contact_phone}`} className="hover:text-white flex items-center gap-1">
              <i className="fas fa-phone text-xs"></i>
              {settings.contact_phone || "+8801700000000"}
            </a>
            <a href={`mailto:${settings.contact_email}`} className="hover:text-white flex items-center gap-1">
              <i className="fas fa-envelope text-xs"></i>
              {settings.contact_email || "info@ayaanmartbd.com"}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">🚚 ঢাকার ভিতরে ডেলিভারি চার্জ ৳60</span>
            <div className="flex gap-3 ml-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" className="hover:text-primary transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" className="hover:text-primary transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" className="hover:text-primary transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                <i className="fas fa-shopping-bag mr-1"></i>
                <span className="hidden sm:inline">Ayaan Mart</span>
                <span className="sm:hidden">AM</span>
              </div>
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded hidden sm:inline">BD</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
              <div className="flex w-full border-2 rounded-lg overflow-hidden" style={{ borderColor: primaryColor }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য খুঁজুন... Search products..."
                  className="flex-1 px-4 py-2.5 outline-none text-sm"
                />
                <button type="submit" className="px-6 text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                  <i className="fas fa-search mr-1"></i>
                  <span className="hidden lg:inline">খুঁজুন</span>
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-primary"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <i className="fas fa-search text-lg"></i>
              </button>

              {/* Wishlist */}
              <Link href="/account" className="p-2 text-gray-600 hover:text-primary hidden sm:block">
                <i className="fas fa-heart text-lg"></i>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 text-gray-600 hover:text-primary relative">
                <i className="fas fa-shopping-cart text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative" ref={dropdownRef}>
                {currentUser ? (
                  <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <i className="fas fa-user text-sm"></i>
                    </div>
                    <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">{currentUser.name}</span>
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary">
                    <i className="fas fa-user text-lg"></i>
                    <span className="hidden lg:inline text-sm">লগইন</span>
                  </Link>
                )}

                {/* User Dropdown */}
                {userDropdownOpen && currentUser && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 animate-fade-in z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <i className="fas fa-user-circle mr-2"></i>
                      My Account
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <i className="fas fa-box mr-2"></i>
                      Orders
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link
                        href="/cpanel"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <i className="fas fa-shield-alt mr-2"></i>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        document.cookie = "token=; path=/; max-age=0";
                        window.location.href = "/";
                      }}
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button className="md:hidden p-2 text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {mobileSearchOpen && (
            <form onSubmit={handleSearch} className="md:hidden pb-3 animate-fade-in">
              <div className="flex border-2 rounded-lg overflow-hidden" style={{ borderColor: primaryColor }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য খুঁজুন..."
                  className="flex-1 px-4 py-2.5 outline-none text-sm"
                />
                <button type="submit" className="px-4 text-white" style={{ backgroundColor: primaryColor }}>
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Navigation */}
        <nav className="border-t hidden md:block">
          <div className="container-custom">
            <div className="flex items-center gap-6">
              {/* Categories Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 py-3 px-4 text-white font-medium text-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <i className="fas fa-th"></i>
                  <span>ক্যাটাগরি</span>
                  <i className="fas fa-chevron-down text-xs ml-1"></i>
                </button>
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-lg py-2 hidden group-hover:block z-50 border">
                  {parentCategories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {cat.icon && <i className={`fas fa-${cat.icon} w-5 text-center text-gray-400`}></i>}
                        <span>{cat.name_bn}</span>
                        <i className="fas fa-chevron-right ml-auto text-xs text-gray-400"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nav Links */}
              <Link href="/" className="py-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                হোম
              </Link>
              <Link href="/shop" className="py-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                সকল পণ্য
              </Link>
              <Link href="/offers" className="py-3 text-sm font-medium text-primary transition-colors">
                <i className="fas fa-fire mr-1"></i>অফার
              </Link>
              <Link href="/about" className="py-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                আমাদের সম্পর্কে
              </Link>
              <Link href="/contact" className="py-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                যোগাযোগ
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-fade-in">
            <div className="container-custom py-4 space-y-2">
              <Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-home mr-3 w-5"></i>হোম
              </Link>
              <Link href="/shop" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-store mr-3 w-5"></i>সকল পণ্য
              </Link>
              <Link href="/offers" className="block py-2 px-4 text-primary hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-fire mr-3 w-5"></i>অফার
              </Link>
              <div className="border-t pt-2">
                <p className="px-4 text-xs font-semibold text-gray-500 mb-1">ক্যাটাগরি</p>
                {parentCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="block py-2 px-8 text-sm text-gray-600 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name_bn}
                  </Link>
                ))}
              </div>
              <div className="border-t pt-2">
                <Link href="/account" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fas fa-user mr-3 w-5"></i>My Account
                </Link>
                {currentUser?.role === "admin" && (
                  <Link href="/cpanel" className="block py-2 px-4 text-red-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                    <i className="fas fa-shield-alt mr-3 w-5"></i>Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

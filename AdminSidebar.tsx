"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "fa-chart-line", href: "/cpanel" },
  { label: "Products", icon: "fa-box", href: "/cpanel/products" },
  { label: "Orders", icon: "fa-shopping-cart", href: "/cpanel/orders" },
  { label: "Categories", icon: "fa-list", href: "/cpanel/categories" },
  { label: "Customers", icon: "fa-users", href: "/cpanel/customers" },
  { label: "Coupons", icon: "fa-ticket", href: "/cpanel/coupons" },
  { label: "Banners", icon: "fa-image", href: "/cpanel/banners" },
  { label: "Settings", icon: "fa-cog", href: "/cpanel/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
  };

  return (
    <aside className="w-64 bg-dark text-white flex-shrink-0 hidden lg:flex lg:flex-col">
      <div className="p-5 border-b border-gray-700">
        <Link href="/cpanel" className="text-xl font-bold">
          <i className="fas fa-shield-alt mr-2 text-red-500"></i>Ayaan Mart Admin
        </Link>
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {NAV_ITEMS.map((nav) => {
          const isActive = nav.href === "/cpanel" ? pathname === "/cpanel" : pathname.startsWith(nav.href);
          return (
            <Link
              key={nav.href}
              href={nav.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <i className={`fas ${nav.icon} w-5`}></i>
              {nav.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-700 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
          <i className="fas fa-external-link-alt w-5"></i>View Website
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors">
          <i className="fas fa-sign-out-alt w-5"></i>Logout
        </button>
      </div>
    </aside>
  );
}

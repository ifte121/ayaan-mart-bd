"use client";
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

interface AdminGuardProps {
  children: (user: { id: number; name: string; email: string; role: string }) => ReactNode;
  title: string;
}

export default function AdminGuard({ children, title }: AdminGuardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") {
          router.push("/cpanel/login");
          return;
        }
        setUser(d.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/cpanel/login");
      });
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-600" onClick={() => setMobileMenuOpen(true)}>
              <i className="fas fa-bars text-lg"></i>
            </button>
            <h1 className="font-bold text-lg">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">{user.name}</span>
            <button
              onClick={() => {
                document.cookie = "token=; path=/; max-age=0";
                router.push("/");
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </header>
        <div>{children(user)}</div>
      </div>
    </div>
  );
}

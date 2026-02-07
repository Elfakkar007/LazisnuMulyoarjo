// components/admin/layout/admin-topbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, User, LogOut, Bell } from 'lucide-react';
import { signOut } from '@/lib/auth/helpers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminTopbarProps {
  isSidebarCollapsed: boolean;
}

export function AdminTopbar({ isSidebarCollapsed }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // Get page title from pathname
  const getPageTitle = () => {
    const paths: Record<string, string> = {
      '/admin/dashboard': 'Dashboard',
      '/admin/profile': 'Profil Organisasi',
      '/admin/financial-years': 'Tahun Keuangan',
      '/admin/kaleng-distribution': 'Distribusi Kaleng',
      '/admin/monthly-income': 'Pemasukan Bulanan',
      '/admin/program-categories': 'Kategori Program',
      '/admin/programs': 'Program Kerja',
      '/admin/transactions': 'Rincian Pengeluaran',
      '/admin/articles': 'Artikel Kegiatan',
      '/admin/homepage-slides': 'Homepage Slides',
    };

    // Check for article edit/new pages
    if (pathname.includes('/articles/') && pathname.includes('/edit')) {
      return 'Edit Artikel';
    }
    if (pathname.includes('/articles/new')) {
      return 'Buat Artikel Baru';
    }

    return paths[pathname] || 'Admin Panel';
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-30 transition-all duration-300 shadow-sm",
        // Hapus "md:left-64" yang statis, ganti dengan logic dinamis:
        isSidebarCollapsed ? "md:left-20" : "md:left-64"
      )}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Back to Website */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Ke Website</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {/* Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-2 md:px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden lg:inline">Admin</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
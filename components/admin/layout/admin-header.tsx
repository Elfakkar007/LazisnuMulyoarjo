// =====================================================
// ADMIN HEADER COMPONENT
// File: components/admin/layout/admin-header.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/helpers';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';

export function AdminHeader() {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    const confirmed = confirm('Apakah Anda yakin ingin keluar?');
    if (!confirmed) return;

    setLoggingOut(true);

    try {
      await signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Gagal logout. Silakan coba lagi.');
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-8">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <Image
              src="/assets/logo.ico"
              alt="LazisNU Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-xs text-gray-500">
              LazisNU Mulyoarjo
            </p>
          </div>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  Administrator
                </p>
                <p className="text-xs text-gray-500">
                  admin@lazisnu-mulyoarjo.org
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Administrator
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      admin@lazisnu-mulyoarjo.org
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </span>
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
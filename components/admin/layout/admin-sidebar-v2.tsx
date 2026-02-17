'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Package,
  TrendingUp,
  FolderKanban,
  Briefcase,
  Receipt,
  FileText,
  Image as ImageIcon,
  X,
  Home,
  LogOut
} from 'lucide-react';
import Image from 'next/image';

interface AdminSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Building2, label: 'Profil Organisasi', href: '/admin/profile' },
  { icon: Calendar, label: 'Tahun Keuangan', href: '/admin/financial-years' },
  { icon: Package, label: 'Distribusi Kaleng', href: '/admin/kaleng-distribution' },
  { icon: TrendingUp, label: 'Pemasukan Bulanan', href: '/admin/monthly-income' },
  { icon: FolderKanban, label: 'Kategori Program', href: '/admin/program-categories' },
  { icon: Briefcase, label: 'Program Kerja', href: '/admin/programs' },
  { icon: Receipt, label: 'Rincian Pengeluaran', href: '/admin/transactions' },
  { icon: FileText, label: 'Artikel Kegiatan', href: '/admin/articles' },
  { icon: ImageIcon, label: 'Homepage Slides', href: '/admin/homepage-slides' },
];

export default function AdminSidebarV2({ onClose, isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch organization profile for logo
    const fetchLogo = async () => {
      try {
        const { getOrganizationProfile } = await import('@/lib/api/client-admin');
        const profile = await getOrganizationProfile();
        if (profile?.logo_url) {
          setLogoUrl(profile.logo_url);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      window.location.href = '/api/auth/signout';
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header with Logo */}
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
        <Link href="/" className="flex items-center gap-2.5">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="LazisNU Mulyoarjo Logo"
              width={36}
              height={36}
              className="object-contain rounded"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">L</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">LazisNU</span>
            <span className="text-xs text-gray-500">Mulyoarjo</span>
          </div>
        </Link>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - Website and Logout Links */}
      <div className="border-t border-gray-200 p-3 space-y-2">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-all duration-200"
        >
          <Home className="h-5 w-5 text-gray-400" />
          <span>Ke Website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
// components/admin/layout/admin-sidebar-v2.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Settings,
  Package,
  TrendingUp,
  Image as ImageIcon,
  Building2,
  ChevronLeft,
  ChevronRight,
  List,
  FolderKanban,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Profil Organisasi',
    href: '/admin/profile',
    icon: Building2,
  },
  {
    name: 'Tahun Keuangan',
    href: '/admin/financial-years',
    icon: TrendingUp,
  },
  {
    name: 'Distribusi Kaleng',
    href: '/admin/kaleng-distribution',
    icon: Package,
  },
  {
    name: 'Pemasukan Bulanan',
    href: '/admin/monthly-income',
    icon: DollarSign,
  },
  {
    name: 'Kategori Program',
    href: '/admin/program-categories',
    icon: Settings,
  },
  {
    name: 'Program Kerja',
    href: '/admin/programs',
    icon: FolderKanban,
  },
  {
    name: 'Rincian Pengeluaran',
    href: '/admin/transactions',
    icon: Receipt,
  },
  {
    name: 'Artikel Kegiatan',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    name: 'Homepage Slides',
    href: '/admin/homepage-slides',
    icon: ImageIcon,
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function AdminSidebarV2({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden md:block fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 text-white overflow-y-auto z-20 transition-all duration-300 shadow-2xl',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-emerald-700">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <Image
                  src="/assets/logo.ico"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">LazisNU</h1>
                <p className="text-xs text-emerald-200">Mulyoarjo</p>
              </div>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="flex justify-center w-full">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                {/* Pastikan logo muncul saat collapsed */}
                <Image
                  src="/assets/logo.ico"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* Toggle Button - Gunakan setIsCollapsed dari props */}
      <div className="p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all group relative',
                isActive
                  ? 'bg-white text-emerald-800 shadow-lg'
                  : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-emerald-600')} />
              {!isCollapsed && <span className="text-sm">{item.name}</span>}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-700">
        {!isCollapsed ? (
          <div className="text-center">
            <p className="text-xs text-emerald-200">Admin Panel</p>
            <p className="text-xs text-emerald-300 font-semibold mt-1">v1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
        )}
      </div>
    </aside>
  );
}
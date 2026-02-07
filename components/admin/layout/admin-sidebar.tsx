// =====================================================
// UPDATED ADMIN SIDEBAR with Profile menu
// File: components/admin/layout/admin-sidebar.tsx (REPLACE)
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Settings,
  Package,
  TrendingUp,
  Image as ImageIcon,
  Building2, // NEW: for Profile
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Profil Organisasi', // NEW
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
    icon: FileText,
  },
  {
    name: 'Rincian Pengeluaran',
    href: '/admin/transactions',
    icon: FileText,
  },
  {
    name: 'Artikel Kegiatan',
    href: '/admin/articles',
    icon: Calendar,
  },
  {
    name: 'Homepage Slides',
    href: '/admin/homepage-slides',
    icon: ImageIcon,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
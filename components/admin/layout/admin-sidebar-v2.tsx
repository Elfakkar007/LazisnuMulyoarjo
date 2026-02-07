'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Package,
  DollarSign,
  FolderKanban,
  BookOpen,
  FileText,
  Presentation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarV2Props {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function AdminSidebarV2({ isCollapsed, setIsCollapsed }: AdminSidebarV2Props) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: Building2,
      label: 'Profil Organisasi',
      href: '/admin/profil-organisasi'
    },
    {
      icon: TrendingUp,
      label: 'Tahun Keuangan',
      href: '/admin/tahun-keuangan'
    },
    {
      icon: Package,
      label: 'Distribusi Kaleng',
      href: '/admin/distribusi-kaleng'
    },
    {
      icon: DollarSign,
      label: 'Pemasukan Bulanan',
      href: '/admin/pemasukan-bulanan'
    },
    {
      icon: FolderKanban,
      label: 'Kategori Program',
      href: '/admin/kategori-program'
    },
    {
      icon: BookOpen,
      label: 'Program Kerja',
      href: '/admin/program-kerja'
    },
    {
      icon: FileText,
      label: 'Rincian Pengeluaran',
      href: '/admin/rincian-pengeluaran'
    },
    {
      icon: FileText,
      label: 'Artikel Kegiatan',
      href: '/admin/artikel-kegiatan'
    },
    {
      icon: Presentation,
      label: 'Homepage Slides',
      href: '/admin/homepage-slides'
    }
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200",
        "transition-all duration-300 ease-in-out",
        "z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-20 border-b border-gray-200 flex items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm block">Admin Dashboard</span>
              <span className="text-xs text-gray-500">LazisNU Mulyoarjo</span>
            </div>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "group relative",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50",
                isCollapsed && "justify-center px-2"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />
              )}

              {/* Icon */}
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-emerald-700" : "text-gray-500 group-hover:text-gray-700"
              )} />

              {/* Label */}
              {!isCollapsed && (
                <span className="flex-1 font-medium text-sm">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
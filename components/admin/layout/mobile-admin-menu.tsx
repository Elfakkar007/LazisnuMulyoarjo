// components/admin/layout/mobile-admin-menu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
    LayoutDashboard,
    FileText,
    DollarSign,
    Settings,
    Package,
    TrendingUp,
    Image as ImageIcon,
    Building2,
    FolderKanban,
    Receipt,
} from 'lucide-react';

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

export function MobileAdminMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-emerald-600 text-white rounded-lg shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    'md:hidden fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white overflow-y-auto z-50 transition-transform duration-300',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-emerald-700 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
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

                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
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
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all',
                                    isActive
                                        ? 'bg-white text-emerald-800 shadow-lg'
                                        : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                                )}
                            >
                                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-emerald-600')} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
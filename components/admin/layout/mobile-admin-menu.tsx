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
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function MobileAdminMenu() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);

    const primaryMenuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            href: '/admin'
        },
        {
            icon: Building2,
            label: 'Profil',
            href: '/admin/profil-organisasi'
        },
        {
            icon: TrendingUp,
            label: 'Keuangan',
            href: '/admin/tahun-keuangan'
        },
        {
            icon: Package,
            label: 'Kaleng',
            href: '/admin/distribusi-kaleng'
        }
    ];

    const moreMenuItems = [
        {
            icon: DollarSign,
            label: 'Pemasukan',
            href: '/admin/pemasukan-bulanan'
        },
        {
            icon: FolderKanban,
            label: 'Kategori',
            href: '/admin/kategori-program'
        },
        {
            icon: BookOpen,
            label: 'Program',
            href: '/admin/program-kerja'
        }
    ];

    return (
        <>
            {/* More Menu Overlay */}
            {showMore && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowMore(false)}
                >
                    <div
                        className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-3">More Menu</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {moreMenuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowMore(false)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-xs font-medium text-center">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex items-center justify-around px-2 py-2">
                    {primaryMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                                    isActive
                                        ? "text-emerald-600"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5",
                                    isActive && "fill-emerald-100"
                                )} />
                                <span className="text-xs font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={cn(
                            "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                            showMore
                                ? "text-emerald-600"
                                : "text-gray-600 hover:text-gray-900"
                        )}
                    >
                        <MoreHorizontal className="w-5 h-5" />
                        <span className="text-xs font-medium">
                            More
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
}
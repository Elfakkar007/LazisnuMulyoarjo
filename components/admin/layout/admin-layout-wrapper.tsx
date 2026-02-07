'use client';

import { useState } from 'react';
import { AdminSidebarV2 } from './admin-sidebar-v2';
import { AdminTopbar } from './admin-topbar';
import { MobileAdminMenu } from './mobile-admin-menu';
import { cn } from '@/lib/utils';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar - Fixed position */}
            <div className="hidden md:block">
                <AdminSidebarV2
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />
            </div>

            {/* Mobile Menu - Only visible on mobile */}
            <div className="md:hidden">
                <MobileAdminMenu />
            </div>

            {/* Topbar - Adjusts based on sidebar state */}
            <AdminTopbar isSidebarCollapsed={isSidebarCollapsed} />

            {/* Main Content - Adjusts margin based on sidebar state */}
            <main
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    // Padding top for topbar
                    "pt-16 md:pt-20",
                    // Padding bottom for mobile menu
                    "pb-20 md:pb-0",
                    // Left margin for desktop sidebar
                    "md:ml-64",
                    // When collapsed, reduce margin
                    isSidebarCollapsed && "md:ml-20",
                    // Padding for content
                    "p-4 md:p-6"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
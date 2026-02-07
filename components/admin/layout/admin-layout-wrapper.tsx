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
            {/* Desktop Sidebar - Always rendered, visibility controlled by CSS */}
            <AdminSidebarV2
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Mobile Menu - Only visible on mobile */}
            <MobileAdminMenu />

            {/* Topbar - Adjusts based on sidebar state */}
            <AdminTopbar isSidebarCollapsed={isSidebarCollapsed} />

            {/* Main Content - Adjusts margin based on sidebar state */}
            <main
                className={cn(
                    "min-h-screen pt-16 md:pt-20 p-4 md:p-6 transition-all duration-300 bg-gray-50",
                    isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
                )}
            >
                <div className="max-w-7xl mx-auto bg-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}
'use client';

import { useState } from 'react';
import AdminSidebarV2 from './admin-sidebar-v2';
import AdminTopbar from './admin-topbar';

import { ToastProvider } from '@/components/ui/toast-provider';
import { ConfirmationProvider } from '@/components/ui/confirmation-modal';

interface AdminLayoutWrapperProps {
    children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <ToastProvider>
            <ConfirmationProvider>
                <div className="flex h-screen overflow-hidden bg-gray-50">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block">
                        <AdminSidebarV2 />
                    </div>

                    {/* Mobile Sidebar Overlay */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 z-40 bg-black/50 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div
                                className="absolute left-0 top-0 h-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <AdminSidebarV2
                                    onClose={() => setIsMobileMenuOpen(false)}
                                    isMobile={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />

                        <main className="flex-1 overflow-y-auto">
                            <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </ConfirmationProvider>
        </ToastProvider>
    );
}
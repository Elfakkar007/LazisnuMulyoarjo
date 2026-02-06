// =====================================================
// ADMIN DASHBOARD LAYOUT
// File: app/admin/(dashboard)/layout.tsx
// Layout untuk semua halaman admin yang memerlukan autentikasi
// =====================================================

import { requireAdmin } from '@/lib/auth/helpers';
import { AdminHeader } from '@/components/admin/layout/admin-header';
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require admin authentication
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-8 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
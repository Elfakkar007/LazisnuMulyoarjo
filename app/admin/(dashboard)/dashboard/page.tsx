// =====================================================
// ADMIN DASHBOARD PAGE
// File: app/admin/(dashboard)/dashboard/page.tsx
// =====================================================

import { getAdminProfile } from '@/lib/auth/helpers';
import { LayoutDashboard, Users, FileText, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const adminProfile = await getAdminProfile();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang, {adminProfile?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600">
          Dashboard Admin LazisNU Mulyoarjo
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Kegiatan"
          value="24"
          icon={FileText}
          color="emerald"
        />
        <StatCard
          title="Program Aktif"
          value="12"
          icon={LayoutDashboard}
          color="blue"
        />
        <StatCard
          title="Anggota Struktur"
          value="35"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Tahun Aktif"
          value="2025"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Sistem Manajemen Admin
        </h2>
        <p className="text-gray-600 mb-6">
          Gunakan menu di sebelah kiri untuk mengelola berbagai aspek website LazisNU Mulyoarjo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureItem
            title="Laporan Keuangan"
            description="Kelola tahun keuangan, pemasukan bulanan, dan distribusi kaleng"
          />
          <FeatureItem
            title="Program Kerja"
            description="Atur kategori program dan program kerja tahunan"
          />
          <FeatureItem
            title="Kegiatan"
            description="Publikasikan artikel dan dokumentasi kegiatan"
          />
          <FeatureItem
            title="Organisasi"
            description="Kelola struktur organisasi dan data pengurus"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
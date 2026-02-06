// =====================================================
// UNAUTHORIZED PAGE
// File: app/admin/unauthorized/page.tsx
// =====================================================

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Akses Ditolak - LazisNU Mulyoarjo',
  description: 'Anda tidak memiliki akses ke halaman ini',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Akses Ditolak
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman admin. 
          Silakan hubungi administrator untuk informasi lebih lanjut.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Kembali ke Beranda
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-lg border border-gray-300 transition-colors"
          >
            Login Sebagai Admin
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Jika Anda merasa ini adalah kesalahan, silakan hubungi:</p>
          <p className="font-semibold mt-2">admin@lazisnu-mulyoarjo.org</p>
        </div>
      </div>
    </div>
  );
}
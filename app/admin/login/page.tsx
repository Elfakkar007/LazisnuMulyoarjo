// =====================================================
// LOGIN PAGE
// File: app/admin/login/page.tsx
// =====================================================

import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Admin - LazisNU Mulyoarjo',
  description: 'Login untuk mengakses dashboard admin LazisNU Mulyoarjo',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="h-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
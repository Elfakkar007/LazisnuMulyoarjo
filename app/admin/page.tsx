// =====================================================
// ADMIN ROOT PAGE
// File: app/admin/page.tsx
// Redirect to dashboard if logged in, otherwise to login
// =====================================================

import { redirect } from 'next/navigation';
import { getUser, isAdmin } from '@/lib/auth/helpers';

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    // Not logged in -> redirect to login
    redirect('/admin/login');
  }

  const adminStatus = await isAdmin();

  if (!adminStatus) {
    // Logged in but not admin -> redirect to unauthorized
    redirect('/admin/unauthorized');
  }

  // Logged in and is admin -> redirect to dashboard
  redirect('/admin/dashboard');
}
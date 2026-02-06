// =====================================================
// RESET PASSWORD PAGE
// File: app/admin/reset-password/page.tsx
// =====================================================

import { ResetPasswordForm } from '@/components/admin/auth/reset-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - LazisNU Mulyoarjo',
  description: 'Buat password baru untuk akun admin',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
// =====================================================
// FORGOT PASSWORD PAGE
// File: app/admin/forgot-password/page.tsx
// =====================================================

import { ForgotPasswordForm } from '@/components/admin/auth/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lupa Password - LazisNU Mulyoarjo',
  description: 'Reset password akun admin',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
// =====================================================
// AUTH VALIDATION UTILITIES
// File: lib/auth/validation.ts
// Fungsi-fungsi validasi yang tidak memerlukan async
// =====================================================

// =====================================================
// VALIDATE EMAIL
// =====================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// =====================================================
// VALIDATE PASSWORD
// Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number
// =====================================================

export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
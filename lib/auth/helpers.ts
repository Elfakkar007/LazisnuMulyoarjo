// =====================================================
// AUTH HELPERS
// File: lib/auth/helpers.ts
// Utility functions untuk authentication & authorization
// =====================================================

'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

// =====================================================
// GET CURRENT USER
// =====================================================

export const getUser = cache(async () => {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

// =====================================================
// GET CURRENT SESSION
// =====================================================

export const getSession = cache(async () => {
  const supabase = await createClient();
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
});

// =====================================================
// CHECK IF USER IS ADMIN
// =====================================================

export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getUser();
  
  if (!user) {
    return false;
  }

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single();

  return !error && !!data;
});

// =====================================================
// GET ADMIN PROFILE
// =====================================================

export const getAdminProfile = cache(async () => {
  const user = await getUser();
  
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
});

// =====================================================
// REQUIRE AUTH - Redirect jika tidak login
// =====================================================

export async function requireAuth() {
  const user = await getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  return user;
}

// =====================================================
// REQUIRE ADMIN - Redirect jika bukan admin
// =====================================================

export async function requireAdmin() {
  const user = await requireAuth();
  const adminStatus = await isAdmin();
  
  if (!adminStatus) {
    redirect('/admin/unauthorized');
  }

  return user;
}

// =====================================================
// SIGN IN
// =====================================================

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Check if user is admin
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', data.user.id)
    .single();

  if (adminError || !adminData) {
    // Sign out immediately if not admin
    await supabase.auth.signOut();
    
    return {
      success: false,
      error: 'Akses ditolak. Anda bukan administrator.',
    };
  }

  return {
    success: true,
    user: data.user,
  };
}

// =====================================================
// SIGN OUT
// =====================================================

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

// =====================================================
// SIGN UP (untuk development/testing)
// Dalam production, admin creation harus via secure method
// =====================================================

export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient();

  // Only allow @lazisnu-mulyoarjo.org emails
  if (!email.endsWith('@lazisnu-mulyoarjo.org')) {
    return {
      success: false,
      error: 'Email harus menggunakan domain @lazisnu-mulyoarjo.org',
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin/login`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    user: data.user,
    message: 'Akun berhasil dibuat. Silakan cek email untuk verifikasi.',
  };
}

// =====================================================
// REQUEST PASSWORD RESET
// =====================================================

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Link reset password telah dikirim ke email Anda.',
  };
}

// =====================================================
// UPDATE PASSWORD
// =====================================================

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Password berhasil diperbarui.',
  };
}
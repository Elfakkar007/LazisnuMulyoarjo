// =====================================================
// AUTH MIDDLEWARE
// File: lib/auth/middleware.ts
// Session update logic untuk Next.js middleware
// =====================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isUnauthorizedPage = request.nextUrl.pathname === '/admin/unauthorized';
  const isForgotPasswordPage = request.nextUrl.pathname === '/admin/forgot-password';
  const isResetPasswordPage = request.nextUrl.pathname === '/admin/reset-password';

  // If accessing admin routes (except login, unauthorized, and password pages)
  if (
    isAdminRoute && 
    !isLoginPage && 
    !isUnauthorizedPage && 
    !isForgotPasswordPage &&
    !isResetPasswordPage
  ) {
    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!adminData) {
      // Redirect to unauthorized page if not admin
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/unauthorized';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If already logged in and trying to access login page
  if (user && isLoginPage) {
    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (adminData) {
      // Redirect to dashboard if already logged in as admin
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}
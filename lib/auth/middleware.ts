// =====================================================
// AUTH MIDDLEWARE
// File: lib/auth/middleware.ts
// Session update logic for Next.js middleware
// Refactored for linear flow and better security
// =====================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // 1. Initialize response
  let supabaseResponse = NextResponse.next({ request });

  try {
    // 2. Create Supabase Client
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
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // 3. Get User
    // IMPORTANT: Do not run any logic between createServerClient and getUser
    const { data: { user }, error } = await supabase.auth.getUser();

    // 4. Define Route Categories
    const path = request.nextUrl.pathname;
    const isAdminRoute = path.startsWith('/admin');
    const isLoginPage = path === '/admin/login';
    const isPublicAdminPage =
      path === '/admin/unauthorized' ||
      path === '/admin/forgot-password' ||
      path === '/admin/reset-password';

    // 5. Handle Auth State & Redirections

    // CASE A: User is NOT logged in (or token invalid)
    if (error || !user) {
      if (isAdminRoute && !isLoginPage && !isPublicAdminPage) {
        // Redirect unauthenticated users trying to access protected admin routes
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('redirectTo', path); // Persist destination
        return NextResponse.redirect(url);
      }
      // Allow access to public routes and login page
      return supabaseResponse;
    }

    // CASE B: User IS logged in
    if (user) {
      // Check if user is actually an admin
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const isUserAdmin = !!adminData;

      // Scenario 1: Logged in user accessing Login page
      if (isLoginPage) {
        if (isUserAdmin) {
          // Redirect Admins to dashboard
          const url = request.nextUrl.clone();
          url.pathname = '/admin/dashboard';
          return NextResponse.redirect(url);
        }
        // Non-admin auth users can stay on login page (to switch accounts?) or could be redirected home
        // For now, let them see login page to potentially sign out
        return supabaseResponse;
      }

      // Scenario 2: Accessing Protected Admin Routes
      if (isAdminRoute && !isPublicAdminPage) {
        if (!isUserAdmin) {
          // Authenticated but NOT an admin
          const url = request.nextUrl.clone();
          url.pathname = '/admin/unauthorized';
          return NextResponse.redirect(url);
        }
        // Is Admin -> Allow access
        return supabaseResponse;
      }
    }

    // Default: Allow access to all other routes
    return supabaseResponse;

  } catch (e) {
    // Failsafe: If anything explodes, treat as unauthenticated
    // But allow public access so the site doesn't crash entirely
    console.error('Middleware Critical Error:', e);
    return NextResponse.next({ request });
  }
}

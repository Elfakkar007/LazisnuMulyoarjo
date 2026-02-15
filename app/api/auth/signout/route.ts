import { signOut } from '@/lib/auth/helpers';
import { NextResponse } from 'next/server';

export async function POST() {
  const result = await signOut();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  // Redirect to login page after successful logout
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), {
    status: 302,
  });
}

// Also support GET for backward compatibility with href links
export async function GET() {
  const result = await signOut();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  // Redirect to login page after successful logout
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), {
    status: 302,
  });
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname.startsWith('/account') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/wishlist') ||
    pathname.startsWith('/admin');

  const isAuthPath =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/wishlist/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};

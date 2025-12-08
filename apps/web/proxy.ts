import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Public routes, no auth needed
const PUBLIC_ROUTES = [
  '/ui/pages/Login',
  '/ui/pages/Register',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// Protected routes, auth required
const PROTECTED_ROUTES = [
  '/admin',
  '/ui/pages/Admin',
  '/dashboard',
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

// Check if route is protected
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

// Validate token signature
async function verifyToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files and internal Next.js requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get access token
  const accessToken = request.cookies.get('access-token')?.value;
  const isTokenValid = await verifyToken(accessToken || '');

  // Handle public routes
  // Redirect authenticated users to admin
  if (isPublicRoute(pathname)) {
    if (isTokenValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/ui/pages/Admin/Index';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Handle protected routes
  // Redirect unauthenticated users to login
  if (isProtectedRoute(pathname)) {
    if (!isTokenValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/ui/pages/Login';
      url.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(url);

      // Clear invalid cookies
      if (accessToken) {
        response.cookies.delete('access-token');
        response.cookies.delete('refresh-token');
      }
      return response;
    }
    return NextResponse.next();
  }

  // Handle root path
  if (pathname === '/') {
    if (isTokenValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/ui/pages/Admin/Index';
      return NextResponse.redirect(url);
    }
    // Allow access to landing page for unauthenticated users
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Dominios ────────────────────────────────────────────────────────────────
// En producción: simplapp.com (marketing) y app.simplapp.com (dashboard)
// En desarrollo: todo corre en localhost (isAppDomain = true por defecto)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'simplapp.com';
const APP_SUBDOMAIN = `app.${ROOT_DOMAIN}`;

function getHostname(request: NextRequest): string {
  return request.headers.get('host') || '';
}

function isAppDomain(hostname: string): boolean {
  // En localhost siempre tratamos como app domain (dashboard)
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) return true;
  // Vercel preview/production domains → tratar como app domain
  if (hostname.endsWith('.vercel.app')) return true;
  // En producción, solo app.simplapp.com es el dashboard
  return hostname === APP_SUBDOMAIN || hostname.startsWith('app.');
}

// ─── Rutas de Auth API (siempre públicas) ────────────────────────────────────
const AUTH_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

function isAuthApiRoute(pathname: string): boolean {
  return AUTH_API_ROUTES.some(route => pathname.startsWith(route));
}

// ─── Páginas de Login/Register (marketing) ───────────────────────────────────
function isAuthPageRoute(pathname: string): boolean {
  return (
    pathname.endsWith('/Login') ||
    pathname.endsWith('/Register') ||
    pathname.endsWith('/Login/') ||
    pathname.endsWith('/Register/')
  );
}

// ─── Rutas protegidas del dashboard ──────────────────────────────────────────
// Prefijos de URL que pertenecen al dashboard SPA.
// El middleware hace rewrite→'/' para evitar conflicto con (marketing)/[country].
const DASHBOARD_ROUTES = [
  '/Dashboard',
  '/dashboard',
  '/ventas-',
  '/inventario-',
  '/profile-settings',
  '/Onboarding',
  '/Settings',
];

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_ROUTES.some(route => pathname.startsWith(route));
}

// ─── Validar JWT ─────────────────────────────────────────────────────────────
async function verifyToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// ─── Middleware principal ─────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostname(request);
  const appDomain = isAppDomain(hostname);

  // Ignorar archivos estáticos y requests internos de Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // TODAS las rutas de API: siempre pasar sin restricción
  // Esto incluye /api/auth/session, /api/bills, /api/clients, etc.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Obtener y validar el token
  const accessToken = request.cookies.get('access-token')?.value;
  const isTokenValid = await verifyToken(accessToken || '');

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMINIO MARKETING: simplapp.com
  // Solo sirve landing y páginas de auth. Si hay sesión → redirige a app.*
  // ═══════════════════════════════════════════════════════════════════════════
  if (!appDomain) {
    // Usuario autenticado en simplapp.com → mandarlo al dashboard
    if (isTokenValid) {
      const appUrl = process.env.NODE_ENV === 'production'
        ? `https://${APP_SUBDOMAIN}/`
        : 'http://localhost:3000/';
      return NextResponse.redirect(appUrl);
    }

    // Páginas de login/register → dejar pasar (son parte del marketing)
    if (isAuthPageRoute(pathname)) {
      return NextResponse.next();
    }

    // Raíz → redirigir a landing (no hay page.tsx en marketing para '/')
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/colombia/';
      return NextResponse.redirect(url);
    }

    // Cualquier otra ruta en simplapp.com → mandarlo a la landing
    const url = request.nextUrl.clone();
    url.pathname = '/colombia/';
    return NextResponse.redirect(url);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMINIO APP: app.simplapp.com (o localhost)
  // Solo sirve el dashboard. Sin sesión → redirige a simplapp.com/Login
  // ═══════════════════════════════════════════════════════════════════════════

  // Páginas de Login/Register en app.* → redirigir al marketing si ya hay sesión
  if (isAuthPageRoute(pathname)) {
    if (isTokenValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    // Sin sesión en app.*/Login → dejar pasar (puede pasar en dev)
    return NextResponse.next();
  }

  // Rutas específicas del dashboard (ventas-*, inventario-*, etc.)
  // Usamos rewrite→'/' para que (dashboard)/layout.tsx las maneje siempre
  // y evitar conflicto con (marketing)/[country]
  if (isDashboardRoute(pathname)) {
    if (!isTokenValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/colombia/Login';
      url.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(url);
      if (accessToken) {
        response.cookies.delete('access-token');
        response.cookies.delete('refresh-token');
      }
      return response;
    }
    return NextResponse.rewrite(new URL('/', request.url));
  }

  // Raíz '/' en app domain
  if (pathname === '/' || pathname === '') {
    if (!isTokenValid) {
      // Sin sesión → mandar a la landing (desde ahí puede ir a Login o Register)
      const url = request.nextUrl.clone();
      url.pathname = '/colombia/';
      return NextResponse.redirect(url);
    }
    // Con sesión → dashboard
    return NextResponse.next();
  }

  // Rutas de marketing (/colombia/, /us/, etc.) → siempre accesibles
  // Esto permite la landing page y que el usuario navegue a Login/Register
  const isMarketingRoute = /^\/[a-zA-Z]{2,15}(\/|$)/.test(pathname) && !isDashboardRoute(pathname);
  if (isMarketingRoute) {
    // Si ya tiene sesión y está en una página de marketing (no auth), mandar al dashboard
    if (isTokenValid && !isAuthPageRoute(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Cualquier otra ruta desconocida sin sesión → login
  if (!isTokenValid) {
    const url = request.nextUrl.clone();
    url.pathname = '/colombia/Login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

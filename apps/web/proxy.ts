import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Dominios ────────────────────────────────────────────────────────────────
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'simplapp.com.co';
const APP_SUBDOMAIN = `app.${ROOT_DOMAIN}`;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getHostname(request: NextRequest): string {
  return request.headers.get('host') || '';
}

function isLocalhost(hostname: string): boolean {
  return hostname.includes('localhost') || hostname.includes('127.0.0.1');
}

function isAppDomain(hostname: string): boolean {
  if (isLocalhost(hostname)) return true;
  if (hostname.endsWith('.vercel.app')) return true;
  return hostname === APP_SUBDOMAIN || hostname.startsWith('app.');
}

// ─── URL helpers para redirects cross-domain ─────────────────────────────────
// En producción, los redirects entre marketing↔app van a dominios distintos.
// En localhost, todo es relativo (mismo dominio).
function marketingUrl(pathname: string, hostname: string): string {
  if (isLocalhost(hostname)) return pathname;
  return `https://${ROOT_DOMAIN}${pathname}`;
}

function appUrl(pathname: string, hostname: string): string {
  if (isLocalhost(hostname)) return pathname;
  return `https://${APP_SUBDOMAIN}${pathname}`;
}

// ─── Páginas de Login/Register ───────────────────────────────────────────────
function isAuthPageRoute(pathname: string): boolean {
  return (
    pathname.endsWith('/Login') ||
    pathname.endsWith('/Register') ||
    pathname.endsWith('/Login/') ||
    pathname.endsWith('/Register/')
  );
}

// ─── Rutas protegidas del dashboard ──────────────────────────────────────────
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
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Obtener y validar el token
  const accessToken = request.cookies.get('access-token')?.value;
  const isTokenValid = await verifyToken(accessToken || '');

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMINIO MARKETING: simplapp.com.co (o www.simplapp.com.co)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!appDomain) {
    // Autenticado → mandar al app domain
    if (isTokenValid) {
      return NextResponse.redirect(appUrl('/', hostname));
    }

    // Login/Register → dejar pasar
    if (isAuthPageRoute(pathname)) {
      return NextResponse.next();
    }

    // Raíz → landing
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/colombia/';
      return NextResponse.redirect(url);
    }

    // Rutas de marketing válidas (/colombia/, etc.) → dejar pasar
    const isValidMarketingPath = /^\/[a-zA-Z]{2,15}(\/|$)/.test(pathname) && !isDashboardRoute(pathname);
    if (isValidMarketingPath) {
      return NextResponse.next();
    }

    // Desconocido → landing
    const url = request.nextUrl.clone();
    url.pathname = '/colombia/';
    return NextResponse.redirect(url);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMINIO APP: app.simplapp.com.co (o localhost)
  // ═══════════════════════════════════════════════════════════════════════════

  // Login/Register en app domain
  if (isAuthPageRoute(pathname)) {
    if (isTokenValid) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Sin sesión → mandar al marketing domain para login
    return NextResponse.redirect(marketingUrl(pathname, hostname));
  }

  // Rutas de marketing en app domain → redirigir al marketing domain
  const isMarketingRoute = /^\/[a-zA-Z]{2,15}(\/|$)/.test(pathname) && !isDashboardRoute(pathname);
  if (isMarketingRoute) {
    return NextResponse.redirect(marketingUrl(pathname, hostname));
  }

  // Rutas del dashboard (ventas-*, inventario-*, etc.)
  if (isDashboardRoute(pathname)) {
    if (!isTokenValid) {
      // Sin sesión → login en el marketing domain
      const loginPath = `/colombia/Login/?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(marketingUrl(loginPath, hostname));
    }
    return NextResponse.rewrite(new URL('/', request.url));
  }

  // Raíz '/' en app domain
  if (pathname === '/' || pathname === '') {
    if (!isTokenValid) {
      // Sin sesión → landing en marketing domain
      return NextResponse.redirect(marketingUrl('/colombia/', hostname));
    }
    // Con sesión → dashboard
    return NextResponse.next();
  }

  // Cualquier otra ruta sin sesión → login en marketing domain
  if (!isTokenValid) {
    const loginPath = `/colombia/Login/?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(marketingUrl(loginPath, hostname));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

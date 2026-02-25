/**
 * Middleware principal (proxy) — Simplapp V2
 * ─────────────────────────────────────────
 * Responsabilidad: orquestar el flujo de routing entre dominios.
 * La lógica de CORS, autenticación y helpers de URL vive en /middleware/*.
 *
 * Flujo:
 *  1. Ignorar estáticos y _next
 *  2. Rutas /api/* → CORS + pasar
 *  3. Verificar sesión (auth-guard)
 *  4. Dominio Marketing → lógica de landing/login
 *  5. Dominio App → lógica de dashboard/onboarding
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleApiRoute } from './middleware/cors';
import { isAuthenticated } from './middleware/auth-guard';
import {
  isAppDomain,
  isAuthPageRoute,
  isDashboardRoute,
  isMarketingCountryRoute,
} from './middleware/routing';

// ─── Helpers locales (dependen del request) ───────────────────────────────────

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'simplapp.com.co';
const APP_SUBDOMAIN = `app.${ROOT_DOMAIN}`;

function getHostname(request: NextRequest): string {
  return request.headers.get('host') || '';
}

function isLocalhost(hostname: string): boolean {
  return hostname.includes('localhost') || hostname.includes('127.0.0.1');
}

/** URL en el dominio de marketing — relativa en localhost */
function marketingUrl(pathname: string, request: NextRequest): string {
  const hostname = getHostname(request);
  if (isLocalhost(hostname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return url.toString();
  }
  return `https://${ROOT_DOMAIN}${pathname}`;
}

/** URL en el dominio de la app — relativa en localhost */
function appUrl(pathname: string, request: NextRequest): string {
  const hostname = getHostname(request);
  if (isLocalhost(hostname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return url.toString();
  }
  return `https://${APP_SUBDOMAIN}${pathname}`;
}

// ─── Middleware principal ─────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostname(request);

  // 1. Ignorar archivos estáticos y requests internos de Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Rutas de API — delegar a cors.ts
  if (pathname.startsWith('/api/')) {
    return handleApiRoute(request);
  }

  // 3. Determinar dominio
  // En localhost no hay subdominios — siempre operamos como app domain.
  // En Vercel previews también.
  const appDomain =
    isLocalhost(hostname) ||
    hostname.endsWith('.vercel.app') ||
    isAppDomain(hostname);

  const isTokenValid = await isAuthenticated(request);

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMINIO MARKETING: simplapp.com.co (o www.simplapp.com.co)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!appDomain) {
    // /Onboarding siempre pertenece al dominio app
    if (pathname.startsWith('/Onboarding')) {
      return NextResponse.redirect(appUrl(pathname.endsWith('/') ? pathname : `${pathname}/`, request));
    }

    // Autenticado → enviar al dashboard
    if (isTokenValid) {
      return NextResponse.redirect(appUrl('/', request));
    }

    // Páginas de auth (Login, Register) → dejar pasar
    if (isAuthPageRoute(pathname)) {
      return NextResponse.next();
    }

    // Raíz → landing de colombia por defecto
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/colombia/';
      return NextResponse.redirect(url);
    }

    // Rutas de país válidas (/colombia/, /mexico/, etc.) → dejar pasar
    if (isMarketingCountryRoute(pathname) && !isDashboardRoute(pathname)) {
      return NextResponse.next();
    }

    // Cualquier otra ruta desconocida → landing
    const url = request.nextUrl.clone();
    url.pathname = '/colombia/';
    return NextResponse.redirect(url);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMINIO APP: app.simplapp.com.co (o localhost)
  // ═══════════════════════════════════════════════════════════════════════════

  // Login/Register en el dominio app
  if (isAuthPageRoute(pathname)) {
    if (isTokenValid) return NextResponse.redirect(new URL('/', request.url));
    if (isLocalhost(hostname)) return NextResponse.next();
    return NextResponse.redirect(marketingUrl(pathname, request));
  }

  // Rutas de marketing en app domain → redirigir al marketing domain
  if (
    isMarketingCountryRoute(pathname) &&
    !pathname.startsWith('/Onboarding')
  ) {
    if (isLocalhost(hostname)) return NextResponse.next();
    return NextResponse.redirect(marketingUrl(pathname, request));
  }

  // Onboarding
  if (pathname.startsWith('/Onboarding')) {
    if (!isTokenValid) {
      const loginPath = `/colombia/Login/?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(marketingUrl(loginPath, request));
    }
    if (!pathname.endsWith('/')) {
      return NextResponse.redirect(new URL(pathname + '/', request.url));
    }
    return NextResponse.next();
  }

  // Raíz '/' en dominio app
  if (pathname === '/' || pathname === '') {
    if (!isTokenValid) {
      if (isLocalhost(hostname)) {
        return NextResponse.redirect(new URL('/colombia/Login/', request.url));
      }
      return NextResponse.redirect(marketingUrl('/colombia/', request));
    }
    return NextResponse.next();
  }

  // ─── TODAS las demás rutas en el dominio app ─────────────────────────────
  // Rutas del dashboard SPA: /ventas-facturacion/, /ventas-clientes/, etc.
  // No existen como páginas reales en Next.js — se sirven vía rewrite al SPA root.
  if (!isTokenValid) {
    // Sin sesión → ir a login
    const loginPath = `/colombia/Login/?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(marketingUrl(loginPath, request));
  }

  // Autenticado → reescribir al SPA (dashboard index)
  return NextResponse.rewrite(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

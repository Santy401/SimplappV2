/**
 * Helpers de routing para el middleware.
 * Responsabilidad única: determinar a qué dominio/ruta pertenece una URL.
 *
 * Configuración de países de marketing:
 *   - Agrega o quita una entrada de MARKETING_COUNTRIES para habilitar/deshabilitar
 *     rutas de landing por país sin tocar lógica de negocio.
 *   - En producción puedes sobreescribir con la variable de entorno
 *     MARKETING_COUNTRIES_EXTRA (CSV de slugs adicionales).
 */

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'simplapp.com.co';

// ─── Países / slugs de marketing habilitados ──────────────────────────────────
// Cada entrada es el segmento que aparece directamente después de `/`
// Ejemplo: 'colombia' → maneja /colombia, /colombia/Login, /colombia/Register…
export const MARKETING_COUNTRIES: readonly string[] = [
    'colombia',
    'mexico',
    'peru',
    'chile',
    'argentina',
    'ecuador',
    'venezuela',
    'bolivia',
    'panama',
    'guatemala',
    'costarica',
    'dominicana',
    'paraguay',
    'uruguay',
];

/**
 * Rutas de autenticación que siempre son parte del dominio de marketing.
 * Se evalúan DESPUÉS del segmento de país.
 */
const AUTH_ROUTES = ['/Login', '/Register', '/forgot-password'];

/**
 * Segmentos de ruta que pertenecen exclusivamente al dominio de la app.
 */
const DASHBOARD_SEGMENTS = [
    'api',
    'Onboarding',
    '_next',
    'favicon.ico',
];

// ─── Funciones de inspection ──────────────────────────────────────────────────

/** ¿El hostname es el dominio de la app? (app.simplapp.com.co) */
export function isAppDomain(hostname: string): boolean {
    return hostname.startsWith('app.') || hostname === `app.${ROOT_DOMAIN}`;
}

/** ¿El pathname pertenece a una ruta de auth tipo /colombia/Login? */
export function isAuthPageRoute(pathname: string): boolean {
    const firstSegment = pathname.split('/')[1] ?? '';
    if (!MARKETING_COUNTRIES.includes(firstSegment)) return false;
    return AUTH_ROUTES.some(r => pathname.includes(r));
}

/** ¿El pathname pertenece al dashboard / rutas de la app? */
export function isDashboardRoute(pathname: string): boolean {
    const firstSegment = pathname.split('/')[1] ?? '';
    return DASHBOARD_SEGMENTS.includes(firstSegment);
}

/** ¿El pathname es una ruta de landing de un país de marketing? */
export function isMarketingCountryRoute(pathname: string): boolean {
    const firstSegment = pathname.split('/')[1] ?? '';
    return MARKETING_COUNTRIES.includes(firstSegment);
}

// ─── Constructores de URL ─────────────────────────────────────────────────────

/** Construye una URL en el dominio de marketing */
export function marketingUrl(pathname: string, protocol = 'https'): string {
    return `${protocol}://${ROOT_DOMAIN}${pathname}`;
}

/** Construye una URL en el dominio de la app */
export function appUrl(pathname: string, protocol = 'https'): string {
    return `${protocol}://app.${ROOT_DOMAIN}${pathname}`;
}

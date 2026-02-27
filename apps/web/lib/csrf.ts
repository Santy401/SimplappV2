/**
 * CSRF Protection — Simplapp V2
 * ──────────────────────────────────────────────────────────────────────────────
 * Estrategia: Origin / Referer verification (sin tokens adicionales).
 *
 * En Next.js con httpOnly cookies y SameSite=Lax, el vector CSRF clásico
 * está muy reducido. Esta capa añade verificación de que las mutaciones
 * (POST/PUT/PATCH/DELETE) vienen de orígenes propios de la app.
 *
 * Referencia: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
 */
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'simplapp.com.co';
const APP_SUBDOMAIN = `app.${ROOT_DOMAIN}`;

/** Métodos que modifican estado — deben verificarse contra CSRF */
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Endpoints que quedan excluidos de la verificación de origen:
 *  - Login/register: se llaman desde el dominio marketing (cross-subdomain)
 *  - Refresh: lo llama el api-client del propio browser
 */
const CSRF_EXEMPT_PATHS = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
];

/**
 * Extrae el hostname limpio de un `Origin` o `Referer` header.
 * Retorna `null` si no puede parsear.
 */
function extractHostname(header: string | null): string | null {
    if (!header) return null;
    try {
        return new URL(header).hostname;
    } catch {
        return null;
    }
}

/**
 * Verifica si el origen de una request pertenece a dominios propios.
 */
function isAllowedOrigin(hostname: string | null): boolean {
    if (!hostname) return false;
    return (
        hostname === ROOT_DOMAIN ||
        hostname === APP_SUBDOMAIN ||
        hostname.endsWith(`.${ROOT_DOMAIN}`) ||
        hostname === 'localhost' ||
        hostname.startsWith('localhost:') ||
        hostname === '127.0.0.1'
    );
}

/**
 * Middleware de CSRF — llama esto al inicio de cada route handler de mutación.
 *
 * @example
 * // En un route handler POST:
 * const csrfError = verifyCsrf(request);
 * if (csrfError) return csrfError;
 *
 * @returns `null` si la request es válida, `NextResponse` 403 si es sospechosa.
 */
export function verifyCsrf(request: NextRequest): NextResponse | null {
    // Solo aplicar a métodos de mutación
    if (!MUTATION_METHODS.has(request.method)) return null;

    // Exentar rutas de auth
    const pathname = request.nextUrl.pathname;
    if (CSRF_EXEMPT_PATHS.some(p => pathname.startsWith(p))) return null;

    // Leer Origin primero, luego Referer como fallback
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    const originHostname = extractHostname(origin);
    const refererHostname = extractHostname(referer);

    // Al menos uno debe ser un origen propio válido
    const isValid = isAllowedOrigin(originHostname) || isAllowedOrigin(refererHostname);

    if (!isValid) {
        console.warn(`[CSRF] Blocked request to ${pathname} — Origin: ${origin ?? 'none'}, Referer: ${referer ?? 'none'}`);
        return NextResponse.json(
            { error: 'Solicitud no permitida' },
            { status: 403 }
        );
    }

    return null;
}

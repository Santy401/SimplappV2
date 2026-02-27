/**
 * Manejo de CORS dinámico para rutas de API.
 * Permite credenciales y orígenes de subdominios propios.
 *
 * @see apps/web/proxy.ts — consume este módulo
 */
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'simplapp.com.co';

const ALLOWED_METHODS = 'GET,DELETE,PATCH,POST,PUT,OPTIONS';
const ALLOWED_HEADERS = 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version';

/**
 * Aplica headers CORS dinámicos a una respuesta.
 * Solo permite orígenes del dominio raíz o localhost.
 */
export function applyCorsHeaders(response: NextResponse, origin: string | null): void {
    if (!origin) return;
    const isAllowed = origin.endsWith(ROOT_DOMAIN) || origin.includes('localhost');
    if (!isAllowed) return;

    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
}

/**
 * Procesa preflight OPTIONS y rutas de API aplicando CORS.
 * Retorna la respuesta lista para ser devuelta por el middleware.
 */
export function handleApiRoute(request: NextRequest): NextResponse {
    const response = request.method === 'OPTIONS'
        ? new NextResponse(null, { status: 204 })
        : NextResponse.next();

    applyCorsHeaders(response, request.headers.get('origin'));
    return response;
}

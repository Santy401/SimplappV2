/**
 * Guardián de autenticación para el middleware.
 * Responsabilidad única: verificar tokens JWT de cookies y decidir si
 * un request está autenticado o no.
 *
 * Usa `jose` (mismo que el resto del proyecto) para no traer dependencias nuevas.
 */
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

/**
 * Verifica el access-token de la cookie del request.
 * @returns `true` si el token es válido y no ha expirado, `false` en cualquier otro caso.
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
    const token = request.cookies.get('access-token')?.value;
    if (!token || !JWT_SECRET) return false;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch {
        // Token inválido, expirado o malformado
        return false;
    }
}

/**
 * Extrae el userId del access-token sin lanzar excepción.
 * Útil para logs o para enriquecer la request en middleware.
 */
export async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
    const token = request.cookies.get('access-token')?.value;
    if (!token || !JWT_SECRET) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return (payload.userId ?? payload.sub ?? null) as string | null;
    } catch {
        return null;
    }
}

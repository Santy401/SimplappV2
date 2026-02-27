import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

type RateLimitOptions = {
    /** Máximo de peticiones permitidas en la ventana */
    limit: number;
    /** Ventana de tiempo en segundos */
    windowSec: number;
};

// Cache en memoria: key = IP+endpoint, value = lista de timestamps de hits
const cache = new LRUCache<string, number[]>({
    max: 5000, // Máximo de IPs distintas que recordamos
    ttl: 60 * 60 * 1000, // 1 hora en ms — limpia automáticamente entradas viejas
});

/**
 * Extrae la IP real del request, considerando proxies (Vercel/Cloudflare).
 */
function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-real-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        'unknown'
    );
}

/**
 * Aplica rate limiting por IP y endpoint.
 * Devuelve `true` si la petición está dentro del límite, `false` si debe ser bloqueada.
 *
 * @example
 * const { allowed, response } = await rateLimit(request, { limit: 5, windowSec: 60 });
 * if (!allowed) return response;
 */
export function rateLimit(
    request: NextRequest,
    options: RateLimitOptions
): { allowed: boolean; response?: NextResponse } {
    const { limit, windowSec } = options;
    const ip = getClientIp(request);
    const endpoint = new URL(request.url).pathname;
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const windowMs = windowSec * 1000;

    const hits = (cache.get(key) ?? []).filter(ts => now - ts < windowMs);

    if (hits.length >= limit) {
        const retryAfter = Math.ceil((hits[0]! + windowMs - now) / 1000);
        return {
            allowed: false,
            response: NextResponse.json(
                {
                    error: 'Demasiadas solicitudes. Por favor espera antes de intentarlo de nuevo.',
                    retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(Math.ceil((hits[0]! + windowMs) / 1000)),
                    },
                }
            ),
        };
    }

    hits.push(now);
    cache.set(key, hits);

    return { allowed: true };
}

/**
 * Helper para extraer parámetros de paginación de una URL de Next.js.
 * ─────────────────────────────────────────────────────────────────
 * Uso en route handlers:
 *   const { skip, take, page } = getPaginationParams(request);
 *   const data = await prisma.client.findMany({ skip, take, ... });
 *
 * El cliente envía:  GET /api/clients?page=2&limit=25
 * Respuesta:         { data: [...], meta: { page, limit, total, totalPages } }
 */
import { NextRequest } from 'next/server';

export interface PaginationParams {
    page: number;   // 1-indexed
    take: number;   // alias: limit
    skip: number;   // calculado: (page - 1) * take
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function getPaginationParams(request: NextRequest): PaginationParams {
    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get('page') ?? `${DEFAULT_PAGE}`, 10) || DEFAULT_PAGE);
    const limit = Math.min(
        MAX_LIMIT,
        Math.max(1, parseInt(searchParams.get('limit') ?? `${DEFAULT_LIMIT}`, 10) || DEFAULT_LIMIT)
    );

    return {
        page,
        take: limit,
        skip: (page - 1) * limit,
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Construye el objeto `meta` estándar para la respuesta paginada.
 * @example
 * return NextResponse.json({ data: clients, meta: buildMeta(page, take, total) });
 */
export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}

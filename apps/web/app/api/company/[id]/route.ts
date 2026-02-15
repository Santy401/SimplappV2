import { NextResponse } from 'next/server';

/**
 * GET /api/company/[id]
 * Obtener empresa por ID (No implementado)
 */
export async function GET() {
    return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

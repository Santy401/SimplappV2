import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';

/**
 * GET /api/categories
 * Obtiene el listado de categorías ordenadas alfabéticamente
 */
export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.categoryProduct.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Error al obtener categorías' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

/**
 * DELETE /api/list-prices/[id]
 * Elimina una lista de precios
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieListPrice = await cookies();
    const accessToken = cookieListPrice.get('access-token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken) as { id: string };;
    if (!payload || !payload.id) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        include: { companies: { include: { company: true } } },
    });

    if (!user || !user.companies?.[0]?.company) {
        return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const { id } = await params;

    const listPricetId = (id);

    const listPrice = await prisma.listPrice.findUnique({
        where: { id: listPricetId },
    });

    if (!listPrice) {
        return NextResponse.json({ error: "Lista no encontrado" }, { status: 404 });
    }

    if (listPrice.companyId !== user.companies[0].company.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.listPrice.delete({
        where: { id: listPricetId },
    });

    return NextResponse.json({ message: "Precio eliminado" }, { status: 200 });
}


/**
 * PUT /api/list-prices/[id]
 * Actualiza una lista de precios existente
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieListPrice = await cookies();
        const accessToken = cookieListPrice.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as { id: string };;
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { companies: { include: { company: true } } },
        });

        if (!user || !user.companies?.[0]?.company) {
            return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
        }

        const { id } = await params;
        const listPriceId = (id);

        const listPrice = await prisma.listPrice.findUnique({
            where: { id: listPriceId },
        });

        if (!listPrice) {
            return NextResponse.json({ error: "precio no encontrado" }, { status: 404 });
        }

        if (listPrice.companyId !== user.companies[0].company.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        const data = await request.json();
        const {
            name: name,
            description: description,
            type: type,
            percentage: percentage,
            companyId: _companyId,
            ...updateData
        } = data;

        if (data.percentage !== undefined) {
            data.percentage = String(data.percentage);
        }

        const updatedClient = await prisma.listPrice.update({
            where: { id: listPriceId },
            data: {
                ...updateData,
                name: name,
                description: description,
                type: type,
                percentage: percentage,
                companyId: _companyId,
            },

        });

        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error('Error updating price:', error);
        return NextResponse.json(
            { error: 'Error al actualizar precio' },
            { status: 500 }
        );
    }
}
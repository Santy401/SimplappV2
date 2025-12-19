import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.id) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(payload.id) },
        include: { company: true },
    });

    if (!user || !user.company) {
        return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const { id } = await params;

    const clientId = Number(id);

    if (isNaN(clientId)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
        where: { id: clientId },
    });

    if (!client) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    if (client.companyId !== user.company.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.client.delete({
        where: { id: clientId },
    });

    return NextResponse.json({ message: "Cliente eliminado" }, { status: 200 });
}


export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(payload.id) },
            include: { company: true },
        });

        if (!user || !user.company) {
            return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
        }

        const { id } = await params;
        const clientId = parseInt(id);

        const client = await prisma.client.findUnique({
            where: { id: clientId },
        });

        if (!client) {
            return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
        }

        if (client.companyId !== user.company.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        const data = await request.json();

        console.log('Actualizando cliente ID:', clientId, 'Data:', data);

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data,
        });

        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Error al actualizar cliente' },
            { status: 500 }
        );
    }
}
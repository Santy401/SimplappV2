import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/interfaces/lib/prisma';


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
        const { id } = await params;
        const clientId = parseInt(id);

        const data = await request.json();

        console.log('Actualizando cliente ID:', clientId, 'Data:', data);

        const client = await prisma.client.update({
            where: { id: clientId },
            data,
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Error al actualizar cliente' },
            { status: 500 }
        );
    }
}
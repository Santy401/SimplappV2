import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ results: [] });
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const payload = await verifyAccessToken(accessToken) as { id: string } | null;
        if (!payload?.id) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { companies: { include: { company: true } } },
        });

        const companyId = user?.companies[0]?.company?.id;
        if (!companyId) return NextResponse.json({ error: 'No se encontró empresa' }, { status: 404 });

        const searchTerm = query.trim();

        // Buscar en Cliente, Producto, Factura en paralelo (limitando resultados por UX y performance)
        const [clients, products, bills] = await Promise.all([
            prisma.client.findMany({
                where: {
                    companyId,
                    deletedAt: null,
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { lastName: { contains: searchTerm, mode: 'insensitive' } },
                        { identification: { contains: searchTerm, mode: 'insensitive' } },
                        { email: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.product.findMany({
                where: {
                    companyId,
                    deletedAt: null,
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { internalId: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.bill.findMany({
                where: {
                    companyId,
                    deletedAt: null,
                    OR: [
                        { clientName: { contains: searchTerm, mode: 'insensitive' } },
                        { legalNumber: { contains: searchTerm, mode: 'insensitive' } },
                        // Prisma no soporta `contains` genérico en campos Int fácilmente sin cast o raw query.
                    ]
                },
                take: 5,
                include: { client: true }
            })
        ]);

        const formattedResults = [
            ...clients.map((c: any) => ({
                type: 'client',
                id: c.id,
                label: `${c.name} ${c.lastName || ''}`.trim(),
                description: `CC/NIT: ${c.identification} - ${c.email || 'Sin correo'}`,
                raw: c
            })),
            ...products.map((p: any) => ({
                type: 'product',
                id: p.id,
                label: p.name,
                description: `Código: ${p.internalId || 'N/A'} - Precio: $${Number(p.price).toLocaleString()}`,
                raw: p
            })),
            ...bills.map((b: any) => ({
                type: 'bill',
                id: b.id,
                label: `Factura ${b.prefix || ''}${b.number}`,
                description: `Cliente: ${b.clientName || 'Consumidor final'} - Total: $${Number(b.total).toLocaleString()}`,
                raw: b
            }))
        ];

        return NextResponse.json({ results: formattedResults });

    } catch (error) {
        console.error('[GlobalSearch API Error]:', error);
        return NextResponse.json({ error: 'Error interno de búsqueda.' }, { status: 500 });
    }
}

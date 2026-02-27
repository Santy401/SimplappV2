import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { getAuthContext } from '@interfaces/lib/auth/session';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ results: [] });
        }

        const auth = await getAuthContext();
        if (!auth) {
            return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
        }

        const { companyId } = auth;
        const searchTerm = query.trim();

        // Ejecutar las búsquedas de forma independiente para que no falle todo si una falla
        const [clientsResult, productsResult, billsResult] = await Promise.allSettled([
            prisma.client.findMany({
                where: {
                    companyId,
                    deletedAt: null,
                    OR: [
                        { firstName: { contains: searchTerm, mode: 'insensitive' } },
                        { firstLastName: { contains: searchTerm, mode: 'insensitive' } },
                        { identificationNumber: { contains: searchTerm, mode: 'insensitive' } },
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
                        { code: { contains: searchTerm, mode: 'insensitive' } },
                        { reference: { contains: searchTerm, mode: 'insensitive' } }
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
                    ]
                },
                take: 5,
                include: { client: true }
            })
        ]);

        const clients = clientsResult.status === 'fulfilled' ? clientsResult.value : [];
        const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
        const bills = billsResult.status === 'fulfilled' ? billsResult.value : [];

        if (clientsResult.status === 'rejected') console.error('[Search API Error - Clients]:', clientsResult.reason);
        if (productsResult.status === 'rejected') console.error('[Search API Error - Products]:', productsResult.reason);
        if (billsResult.status === 'rejected') console.error('[Search API Error - Bills]:', billsResult.reason);

        const formattedResults = [
            ...clients.map((c: any) => ({
                type: 'client',
                id: c.id,
                label: `${c.firstName || c.name || ''} ${c.firstLastName || c.lastName || ''}`.trim(),
                description: `ID: ${c.identificationNumber || c.identification} - ${c.email || 'Sin correo'}`,
                raw: c
            })),
            ...products.map((p: any) => ({
                type: 'product',
                id: p.id,
                label: p.name,
                description: `Código: ${p.code || p.internalId || 'N/A'} - Precio: $${Number(p.basePrice || p.price || 0).toLocaleString()}`,
                raw: p
            })),
            ...bills.map((b: any) => ({
                type: 'bill',
                id: b.id,
                label: `Factura ${b.prefix || ''}${b.number}`,
                description: `Cliente: ${b.clientName || 'Consumidor final'} - Total: $${Number(b.total || 0).toLocaleString()}`,
                raw: b
            }))
        ];

        return NextResponse.json({ results: formattedResults });

    } catch (error) {
        console.error('[GlobalSearch API Error]:', error);
        return NextResponse.json({ error: 'Error interno de búsqueda.' }, { status: 500 });
    }
}

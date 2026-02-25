import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';
import Papa from 'papaparse';
import { rateLimit } from '@/lib/rate-limit';

const ALLOWED_ENTITIES = ['clients', 'products', 'sellers', 'stores'] as const;
type Entity = typeof ALLOWED_ENTITIES[number];

/**
 * GET /api/export?entity=[entity]
 * Exporta un CSV de la entidad solicitada para la empresa del usuario
 */
export async function GET(request: NextRequest) {
    const { allowed, response: rateLimitResponse } = rateLimit(request, {
        limit: 10,
        windowSec: 60, // 10 exports por minuto
    });
    if (!allowed) return rateLimitResponse!;

    try {
        const searchParams = request.nextUrl.searchParams;
        const entityParam = searchParams.get('entity') as Entity | null;

        if (!entityParam || !ALLOWED_ENTITIES.includes(entityParam as any)) {
            return NextResponse.json({ error: 'Entidad inválida.' }, { status: 400 });
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
        if (!companyId) return NextResponse.json({ error: 'No se encontró la empresa del usuario' }, { status: 404 });

        let data: any[] = [];
        let filename = '';

        // Consultar datos según la entidad y preparar para el CSV (aplanar objetos anidados)
        switch (entityParam) {
            case 'clients':
                const clients = await prisma.client.findMany({
                    where: { companyId, deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                });
                data = clients.map(c => ({
                    ID: c.id,
                    Identificación: c.identification,
                    Nombre: c.name,
                    Apellido: c.lastName,
                    Nombre_Legal: c.legalName,
                    Email: c.email,
                    Teléfono: c.phone,
                    Tipo_Organización: c.organizationType,
                    Tipo_Régimen: c.taxRegime,
                    Ciudad: c.city,
                    Dirección: c.address,
                    Creado_En: c.createdAt.toISOString().split('T')[0],
                }));
                filename = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
                break;

            case 'products':
                const products = await prisma.product.findMany({
                    where: { companyId, deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                });
                data = products.map(p => ({
                    Código: p.internalId,
                    Nombre: p.name,
                    Tipo: p.productType,
                    Precio: p.price,
                    Impuesto: p.tax,
                    Categoría: p.categoryId,
                    Creado_En: p.createdAt.toISOString().split('T')[0],
                }));
                filename = `productos_${new Date().toISOString().split('T')[0]}.csv`;
                break;

            case 'sellers':
                const sellers = await prisma.seller.findMany({
                    where: { companyId, deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                });
                data = sellers.map(s => ({
                    ID: s.id,
                    Identificación: s.identification,
                    Nombre: s.name,
                    Apellido: s.lastName,
                    Email: s.email,
                    Teléfono: s.phone,
                    Sucursal_Principal: s.mainStoreId,
                    Activo: s.active,
                    Creado_En: s.createdAt.toISOString().split('T')[0],
                }));
                filename = `vendedores_${new Date().toISOString().split('T')[0]}.csv`;
                break;

            case 'stores':
                const stores = await prisma.store.findMany({
                    where: { companyId, deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                });
                data = stores.map(s => ({
                    ID: s.id,
                    Nombre: s.name,
                    Código: s.storeCode,
                    Dirección: s.address,
                    Ciudad: s.city,
                    Télefono: s.phone,
                    Email: s.email,
                    Activo: s.active,
                    Creado_En: s.createdAt.toISOString().split('T')[0],
                }));
                filename = `bodegas_${new Date().toISOString().split('T')[0]}.csv`;
                break;
        }

        if (data.length === 0) {
            return NextResponse.json({ error: 'No hay datos para exportar.' }, { status: 404 });
        }

        const csvData = Papa.unparse(data, { header: true });

        return new NextResponse(csvData, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error(`[Export Error] Failed to export ${request.url}:`, error);
        return NextResponse.json({ error: 'Error interno al exportar los datos.' }, { status: 500 });
    }
}

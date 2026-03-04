import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';

export async function GET(_request: NextRequest) {
    try {
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

        const now = new Date();
        const startCurrentMonth = startOfMonth(now);
        const endCurrentMonth = endOfMonth(now);

        const startPreviousMonth = startOfMonth(subMonths(now, 1));
        const endPreviousMonth = endOfMonth(subMonths(now, 1));

        // Obtener facturas en estado validado
        const validStatuses = ['ISSUED', 'PAID', 'PARTIALLY_PAID'];

        // 1. Total Ventas mes actual (Suma de subtotal, o total?) Usaremos `total`
        const currentMonthBills = await prisma.bill.aggregate({
            _sum: { total: true },
            where: {
                companyId,
                status: { in: validStatuses as string[] },
                deletedAt: null,
                date: { gte: startCurrentMonth, lte: endCurrentMonth }
            }
        });

        const previousMonthBills = await prisma.bill.aggregate({
            _sum: { total: true },
            where: {
                companyId,
                status: { in: validStatuses as any },
                deletedAt: null,
                date: { gte: startPreviousMonth, lte: endPreviousMonth }
            }
        });

        const currentSales = Number(currentMonthBills._sum.total || 0);
        const previousSales = Number(previousMonthBills._sum.total || 0);
        const salesGrowth = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 100;

        // 2. Facturas Pendientes de Pago (Balance > 0)
        const pendingBillsCount = await prisma.bill.count({
            where: {
                companyId,
                status: { in: ['ISSUED', 'PARTIALLY_PAID', 'TO_PAY'] },
                deletedAt: null,
                balance: { gt: 0 }
            }
        });

        const pendingBillsValue = await prisma.bill.aggregate({
            _sum: { balance: true },
            where: {
                companyId,
                status: { in: ['ISSUED', 'PARTIALLY_PAID', 'TO_PAY'] },
                deletedAt: null,
                balance: { gt: 0 }
            }
        });

        // 3. Clientes Activos Totales
        const totalClients = await prisma.client.count({
            where: {
                companyId,
                deletedAt: null
            }
        });

        // 4. Últimas facturas listado
        const recentBills = await prisma.bill.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { date: 'desc' },
            take: 5,
            select: {
                id: true,
                prefix: true,
                number: true,
                clientName: true,
                total: true,
                status: true,
                date: true
            }
        });

        // 5. Histórico general de últimos 6 meses para gráfico
        const sixMonthsAgo = startOfMonth(subMonths(now, 5)); // 5 en vez de 6 para incluir mes actual como 6to
        const all6MonthsBills = await prisma.bill.findMany({
            where: {
                companyId,
                status: { in: validStatuses as string[] },
                deletedAt: null,
                date: { gte: sixMonthsAgo }
            },
            select: { total: true, date: true }
        });

        const monthlySalesMap: Record<string, number> = {};
        for (let i = 5; i >= 0; i--) {
            const mDate = subMonths(now, i);
            const mKey = format(mDate, "MMM", { locale: es }).toUpperCase(); // "ENE", "FEB"
            monthlySalesMap[mKey] = 0;
        }

        all6MonthsBills.forEach((b: { date: Date, total: string | number }) => {
            const label = format(b.date, "MMM", { locale: es }).toUpperCase();
            if (monthlySalesMap[label] !== undefined) {
                monthlySalesMap[label] += Number(b.total);
            }
        });

        const monthlySales = Object.entries(monthlySalesMap).map(([name, total]) => ({ name, total }));


        return NextResponse.json({
            totals: {
                currentSales,
                previousSales,
                salesGrowth,
                pendingBillsCount,
                pendingBillsValue: Number(pendingBillsValue._sum.balance || 0),
                totalClients
            },
            recentBills,
            monthlySales
        });

    } catch (error) {
        console.error('[Metrics Dashboard Error]:', error);
        return NextResponse.json({ error: 'Error interno obteniendo métricas' }, { status: 500 });
    }
}

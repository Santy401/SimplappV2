import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, format, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { BillStatus } from '@prisma/client';

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

        const url = new URL(_request.url);
        const yearParam = url.searchParams.get('year');
        const selectedYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

        const startCurrentYear = startOfYear(new Date(selectedYear, 0, 1));
        const endCurrentYear = endOfYear(new Date(selectedYear, 0, 1));

        const startPreviousYear = startOfYear(new Date(selectedYear - 1, 0, 1));
        const endPreviousYear = endOfYear(new Date(selectedYear - 1, 0, 1));

        const validStatuses: BillStatus[] = [BillStatus.ISSUED, BillStatus.PAID, BillStatus.PARTIALLY_PAID, BillStatus.TO_PAY];

        const currentYearBills = await prisma.bill.findMany({
            where: {
                companyId,
                status: { in: validStatuses },
                deletedAt: null,
                date: { gte: startCurrentYear, lte: endCurrentYear }
            },
            select: { total: true, appliedCreditNoteTotal: true }
        });

        const previousYearBills = await prisma.bill.findMany({
            where: {
                companyId,
                status: { in: validStatuses },
                deletedAt: null,
                date: { gte: startPreviousYear, lte: endPreviousYear }
            },
            select: { total: true, appliedCreditNoteTotal: true }
        });

        const currentSales = currentYearBills.reduce((sum, b) => sum + (Number(b.total) - Number(b.appliedCreditNoteTotal || 0)), 0);
        const previousSales = previousYearBills.reduce((sum, b) => sum + (Number(b.total) - Number(b.appliedCreditNoteTotal || 0)), 0);
        const salesGrowth = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : (currentSales > 0 ? 100 : 0);

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
                date: true,
                paymentMethod: true
            }
        });

        // 5. Histórico general de los 12 meses del año seleccionado para gráfico
        const allYearBills = await prisma.bill.findMany({
            where: {
                companyId,
                status: { in: validStatuses },
                deletedAt: null,
                date: { gte: startCurrentYear, lte: endCurrentYear }
            },
            select: { total: true, appliedCreditNoteTotal: true, date: true }
        });

        const monthlySalesMap: Record<string, number> = {};
        for (let i = 0; i < 12; i++) {
            const mDate = new Date(selectedYear, i, 1);
            const mKey = format(mDate, "MMM", { locale: es }).toUpperCase();
            monthlySalesMap[mKey] = 0;
        }

        allYearBills.forEach((b) => {
            const label = format(b.date, "MMM", { locale: es }).toUpperCase();
            if (monthlySalesMap[label] !== undefined) {
                monthlySalesMap[label] += Number(b.total) - Number(b.appliedCreditNoteTotal || 0);
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

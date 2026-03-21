import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { createNotification } from '@/lib/notify';

/**
 * POST /api/bills/[id]/issue
 * Emitir factura
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as { id: string };
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { companies: { include: { company: true } } }, // Multi-tenant update
        });

        const company = user?.companies[0]?.company;

        if (!user || !company) {
            return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
        }

        const { id } = await params;

        const bill = await prisma.bill.findFirst({
            where: {
                id,
                companyId: company.id,
            },
        });

        if (!bill) {
            return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
        }

        if (bill.status !== 'DRAFT') {
            // 🧑‍🏫 MENTOR FIX: Idempotencia. Si el frontend dispara 2 peticiones (PUT e ISSUE)
            // y el PUT ya la emitió, no lanzamos error 400 ni duplicamos notificaciones, simplemente devolvemos.
            if (['ISSUED', 'TO_PAY', 'PAID', 'PARTIALLY_PAID'].includes(bill.status)) {
                 return NextResponse.json(bill);
            }
            
            return NextResponse.json(
                { error: 'Solo se pueden emitir facturas en estado borrador.' },
                { status: 400 }
            );
        }

        // 🧑‍🏫 MENTOR FIX: Dependencia comercial del método de pago
        let targetStatus = 'ISSUED';
        let targetBalance = String(bill.balance);

        if (bill.paymentMethod === 'CREDIT') {
            targetStatus = 'TO_PAY';
            targetBalance = String(bill.total); // Si emiten a crédito, el saldo exigible es todo el total
        } else if (Number(bill.balance) <= 0) {
            targetStatus = 'PAID';
            targetBalance = '0';
        }

        const updatedBill = await prisma.bill.update({
            where: { id },
            data: {
                status: targetStatus as any,
                balance: targetBalance,
            },
        });

        // 🔔 Notificación: factura emitida
        void createNotification({
            userId: payload.id,
            companyId: company.id,
            title: 'Factura emitida exitosamente',
            message: `La factura ha sido emitida y está lista para enviar a la DIAN.`,
            type: 'SUCCESS',
            link: 'Sales/Bills',
        });

        return NextResponse.json(updatedBill);
    } catch (error) {
        console.error('Error issuing bill:', error);
        return NextResponse.json(
            { error: 'Error al emitir factura' },
            { status: 500 }
        );
    }
}

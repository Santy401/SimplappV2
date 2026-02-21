import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { DianStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

/**
 * GET /api/dian/status/[billId]
 * Verificar estado de factura en DIAN
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ billId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const payload = await verifyAccessToken(accessToken) as { id: string };
        if (!payload?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { companies: { include: { company: true } } },
        });

        const company = user?.companies[0]?.company;

        if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

        const { billId } = await params;

        const bill = await prisma.bill.findFirst({
            where: { id: billId, companyId: company.id },
            select: {
                dianStatus: true,
                cufe: true,
                dianResponse: true,
                pdfUrl: true,
                rejectedReason: true,
                sentAt: true,
                acceptedAt: true
            }
        });

        if (!bill) return NextResponse.json({ error: 'Bill not found' }, { status: 404 });

        // AQUÍ DEBERÍAS SOLICITAR EL STATUS A LA DIAN Y ACTUALIZAR TU DB SI ES NECESARIO
        // simulamos q se aceptó
        if (bill.dianStatus === DianStatus.PENDING) {
            const updated = await prisma.bill.update({
                where: { id: billId },
                data: {
                    dianStatus: DianStatus.ACCEPTED,
                    acceptedAt: new Date(),
                    dianResponse: '{"StatusCode": "0", "Message": "Procesado Correctamente."}'
                },
                select: {
                    dianStatus: true,
                    cufe: true,
                    dianResponse: true,
                    pdfUrl: true,
                    rejectedReason: true,
                    sentAt: true,
                    acceptedAt: true
                }
            });
            return NextResponse.json(updated);
        }

        return NextResponse.json(bill);
    } catch (error) {
        console.error('Error status DIAN:', error);
        return NextResponse.json({ error: 'Error al consultar estado DIAN' }, { status: 500 });
    }
}

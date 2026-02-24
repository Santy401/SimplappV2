import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { DianStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

/**
 * POST /api/dian/send/[billId]
 * Enviar factura a DIAN
 */
export async function POST(
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
        });

        if (!bill) return NextResponse.json({ error: 'Bill not found' }, { status: 404 });

        if (bill.status !== 'ISSUED') {
            return NextResponse.json({ error: 'Debe emitir la factura antes de enviarla a la DIAN.' }, { status: 400 });
        }

        if (bill.dianStatus === DianStatus.ACCEPTED) {
            return NextResponse.json({ error: 'La factura ya ha sido aceptada por la DIAN.' }, { status: 400 });
        }

        // AQUI IRIAN LAS CREDENCIALES, LIBRERIA Y LLAMADA A LA DIAN.
        // Esto es un mock temporal en espera de tu lógica real
        const mockCufe = "CUFE-mock-" + Date.now();
        const mockPdfUrl = "https://dian.gov.co/mock/" + mockCufe + ".pdf";

        const updatedBill = await prisma.bill.update({
            where: { id: billId },
            data: {
                dianStatus: DianStatus.PENDING,
                cufe: mockCufe,
                pdfUrl: mockPdfUrl,
                sentAt: new Date()
            },
        });

        return NextResponse.json(updatedBill);
    } catch (error) {
        console.error('Error enviando a DIAN:', error);
        return NextResponse.json({ error: 'Error al comunicarse con la DIAN' }, { status: 500 });
    }
}

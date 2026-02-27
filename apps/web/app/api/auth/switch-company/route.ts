import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

/**
 * POST /api/auth/switch-company
 * Cambia la empresa activa para el usuario (actualiza lastCompanyId)
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as { id: string };
        if (!payload?.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { companyId } = await request.json();

        if (!companyId) {
            return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
        }

        // Verificar que el usuario tenga acceso a esa empresa
        const userCompany = await prisma.userCompany.findUnique({
            where: {
                userId_companyId: {
                    userId: payload.id,
                    companyId: companyId
                }
            }
        });

        if (!userCompany) {
            return NextResponse.json({ error: 'No tienes acceso a esta empresa' }, { status: 403 });
        }

        // Actualizar lastCompanyId en el usuario
        await prisma.user.update({
            where: { id: payload.id },
            data: { lastCompanyId: companyId }
        });

        return NextResponse.json({ message: 'Empresa cambiada exitosamente' });

    } catch (error) {
        console.error('Switch company error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

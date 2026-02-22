import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

export async function GET(request: NextRequest) {
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
            include: { companies: { include: { company: true } } },
        });

        if (!user || !user.companies?.[0]?.company) {
            return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
        }

        const activityLogs = await prisma.activityLog.findMany({
            where: {
                companyId: user.companies[0].company.id,
            },
            include: {
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50, // Límite para evitar mucha carga
        });

        return NextResponse.json(activityLogs);
    } catch (error) {
        console.error('Error fetching activity log:', error);
        return NextResponse.json(
            { error: 'Error al obtener log de actividad' },
            { status: 500 }
        );
    }
}

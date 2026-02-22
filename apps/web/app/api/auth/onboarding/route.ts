import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

/**
 * POST /api/auth/onboarding
 * Completa el onboarding del usuario (actualiza campos de empresa y usuario)
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as { id: string };

        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const body = await request.json();
        const {
            userType,
            companyName,
            country,
            currency,
            companyLogo,
            invoicePrefix,
            defaultTax
        } = body;

        // Actualizar usuario con los datos de onboarding
        const updatedUser = await prisma.user.update({
            where: { id: payload.id },
            data: {
                userType,
                companyName,
                country,
                currency,
                companyLogo,
                invoicePrefix,
                defaultTax,
                onboardingCompleted: true,
            },
        });

        return NextResponse.json({
            message: 'Onboarding completado exitosamente',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error en onboarding:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar el onboarding' },
            { status: 500 }
        );
    }
}

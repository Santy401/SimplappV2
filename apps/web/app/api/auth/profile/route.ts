import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

/**
 * PUT /api/auth/profile
 * Actualiza los datos de perfil del usuario
 */
export async function PUT(request: NextRequest) {
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
            name, country, companyName, companyLogo,
            profileLogo, language, timezone,
            legalName, businessType, industry,
            taxIdentification, taxRegime, taxResponsibilities,
            state, city, address, zipCode,
            currency, invoicePrefix, invoiceInitialNumber, defaultTax,
            phone, billingEmail, website
        } = body;

        // Actualizar usuario con los nuevos datos
        const updatedUser = await prisma.user.update({
            where: { id: payload.id },
            data: {
                name, country, companyName, companyLogo,
                profileLogo, language, timezone,
                legalName, businessType, industry,
                taxIdentification, taxRegime, taxResponsibilities,
                state, city, address, zipCode,
                currency, invoicePrefix, invoiceInitialNumber, defaultTax,
                phone, billingEmail, website
            },
        });

        return NextResponse.json({
            message: 'Perfil actualizado exitosamente',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la actualización', details: (error as any).message || String(error) },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { getAuthContext } from '@interfaces/lib/auth/session';

/**
 * PUT /api/auth/profile
 * Actualiza los datos de perfil del usuario
 */
export async function PUT(request: NextRequest) {
    try {
        const auth = await getAuthContext();
        if (!auth) {
            return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
        }

        const { userId, companyId } = auth;
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

        // Extraer campos de usuario y compañía
        const userFields = {
            name, country, profileLogo, language, timezone
        };
        const companyFields = {
            companyName,
            logoUrl: companyLogo,
            commercialName: legalName,
            // businessType, no existe en company actual
            economicActivity: industry,
            identificationNumber: taxIdentification,
            // taxRegime mapped to vatCondition on company type but UI sends string. We skip if Enum is needed or map it
            // ...(taxRegime && { vatCondition: taxRegime }), 
            // taxResponsibilities, 
            department: state,
            municipality: city,
            address,
            postalCode: zipCode,
            currency,
            invoicePrefix,
            invoiceInitialNumber,
            defaultTax,
            phone,
            email: billingEmail,
            website
        };

        // Actualizar usuario con los nuevos datos
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: userFields,
        });

        // Actualizar compañia base asociadas a este usuario.
        await prisma.company.update({
            where: { id: companyId },
            data: companyFields
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

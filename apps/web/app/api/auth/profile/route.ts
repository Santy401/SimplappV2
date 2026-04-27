import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { getAuthContext } from '@interfaces/lib/auth/session';

/**
 * GET /api/auth/profile
 * Obtiene los datos de perfil del usuario y empresa
 */
export async function GET() {
    try {
        const auth = await getAuthContext();
        if (!auth) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { userId, companyId } = auth;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                country: true,
                profileLogo: true,
                language: true,
                timezone: true
            }
        });

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: {
                companyName: true,
                commercialName: true,
                logoUrl: true,
                identificationNumber: true,
                department: true,
                municipality: true,
                address: true,
                postalCode: true,
                phone: true,
                email: true,
                website: true,
                currency: true,
                invoicePrefix: true,
                invoiceInitialNumber: true,
                defaultTax: true
            }
        });

        return NextResponse.json({
            user: user,
            company: company,
            companyLogo: company?.logoUrl || undefined
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
    }
}

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
            legalName, industry,
            taxIdentification, taxRegime,
            state, city, address, zipCode,
            currency, invoicePrefix, invoiceInitialNumber, defaultTax,
            phone, billingEmail, website
        } = body;

        // Mapeo de régimen fiscal a enum VatCondition
        const mapVatCondition = (regime: string) => {
            if (!regime) return undefined;
            const r = regime.toLowerCase();
            if (r.includes('común') || r.includes('responsable') || r.includes('simple')) return 'RESPONSABLE';
            if (r.includes('simplificado')) return 'SIMPLIFIED_REGIME';
            if (r.includes('no responsable')) return 'NO_RESPONSABLE';
            if (r.includes('exento')) return 'EXENTO';
            return undefined;
        };

        // Extraer campos de usuario y compañía
        const userFields = {
            name, country, profileLogo, language, timezone
        };
        const companyFields: any = {
            companyName,
            logoUrl: companyLogo,
            commercialName: legalName,
            economicActivity: industry,
            identificationNumber: taxIdentification,
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

        const vatCondition = mapVatCondition(taxRegime);
        if (vatCondition) {
            companyFields.vatCondition = vatCondition;
        }

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
            { error: 'Error interno del servidor al procesar la actualización', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

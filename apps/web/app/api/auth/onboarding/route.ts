import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';
import { verifyCsrf } from '@/lib/csrf';
import { parseBody, onboardingApiSchema } from '@/lib/api-schemas';
import { createNotification } from '@/lib/notify';

/**
 * POST /api/auth/onboarding
 * Completa el onboarding del usuario (actualiza campos de empresa y usuario)
 */
export async function POST(request: NextRequest) {
    // CSRF check — onboarding es una mutación sensible de información fiscal
    const csrfError = verifyCsrf(request);
    if (csrfError) return csrfError;

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

        // ─── Validación con Zod ────────────────────────────────────────────────
        const parsed = parseBody(body, onboardingApiSchema);
        if (!parsed.success) return parsed.errorResponse;
        const { userType, companyName, country, currency, companyLogo, invoicePrefix, defaultTax } = parsed.data;

        // ─── Validación del logo ─────────────────────────────────────────────
        // Los logos Base64 pueden ser muy grandes y saturar la columna + cada query de sesión
        const MAX_LOGO_BYTES = 500 * 1024; // 500 KB máximo en Base64
        if (companyLogo && companyLogo.length > MAX_LOGO_BYTES) {
            return NextResponse.json(
                { error: 'El logo es demasiado grande. Máximo 500 KB.' },
                { status: 400 }
            );
        }

        // ─── Actualizar usuario con datos de onboarding ───────────────────────
        const updatedUser = await prisma.user.update({
            where: { id: payload.id },
            data: {
                userType,
                companyName,
                country,
                currency,
                invoicePrefix: invoicePrefix.toUpperCase(),
                defaultTax,  // String validado como numérico por Zod
                onboardingCompleted: true,
                // Solo guardar logo si se proporcionó
                ...(companyLogo !== undefined && { companyLogo }),
            },
        });

        // No devolver el logo en la respuesta (puede ser muy grande)
        const { companyLogo: _logo, ...safeUser } = updatedUser;

        // 🔔 Notificación de bienvenida — ahora que el usuario tiene empresa asignada
        const userCompanies = await prisma.userCompany.findMany({
            where: { userId: payload.id },
            select: { companyId: true },
        });
        const companyId = userCompanies[0]?.companyId;

        if (companyId) {
            void createNotification({
                userId: payload.id,
                companyId,
                title: `¡Bienvenido a Simplapp, ${updatedUser.name}!`,
                message: 'Tu cuenta está lista. Puedes empezar a crear facturas y gestionar tu empresa.',
                type: 'SUCCESS',
                link: 'Dashboard',
            });
        }

        return NextResponse.json({
            message: 'Onboarding completado exitosamente',
            user: safeUser,
        });
    } catch (error) {
        console.error('Error en onboarding:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar el onboarding' },
            { status: 500 }
        );
    }
}

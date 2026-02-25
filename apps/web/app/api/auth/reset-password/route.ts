import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { verifyCsrf } from '@/lib/csrf';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const schema = z.object({
    token: z.string().min(64).max(64),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga'),
});

/**
 * POST /api/auth/reset-password
 *
 * Verifica el token y actualiza la contraseña.
 * Rate limited: 5 intentos por IP cada 15 minutos.
 */
export async function POST(request: NextRequest) {
    const csrfError = verifyCsrf(request);
    if (csrfError) return csrfError;

    const { allowed, response: rateLimitResponse } = rateLimit(request, {
        limit: 5,
        windowSec: 15 * 60,
    });
    if (!allowed) return rateLimitResponse!;

    try {
        const body = await request.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            const issues = (parsed.error as any).issues ?? [];
            return NextResponse.json(
                { error: issues[0]?.message ?? 'Datos inválidos' },
                { status: 400 }
            );
        }

        const { token, password } = parsed.data;

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken) {
            return NextResponse.json({ error: 'El enlace no es válido.' }, { status: 400 });
        }

        if (resetToken.used) {
            return NextResponse.json({ error: 'Este enlace ya fue utilizado. Solicita uno nuevo.' }, { status: 400 });
        }

        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json({ error: 'El enlace ha expirado. Solicita uno nuevo.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Actualizar contraseña + invalidar token + revocar refresh tokens — todo en una transacción
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
            prisma.refreshToken.deleteMany({
                where: { userId: resetToken.userId },
            }),
        ]);

        return NextResponse.json({
            message: 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.',
        });
    } catch (error) {
        console.error('[reset-password] Error:', error);
        return NextResponse.json({ error: 'Error al restablecer la contraseña.' }, { status: 500 });
    }
}

/**
 * GET /api/auth/reset-password?token=xxx
 * Valida si un token es válido antes de mostrar el formulario.
 */
export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');

    if (!token || token.length !== 64) {
        return NextResponse.json({ valid: false, error: 'Token inválido' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
        return NextResponse.json({ valid: false, error: 'El enlace no es válido o ha expirado.' }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
}

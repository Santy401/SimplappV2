import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
        }

        const verificationToken = await prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
        }

        if (verificationToken.expiresAt < new Date()) {
            await prisma.emailVerificationToken.delete({ where: { id: verificationToken.id } });
            return NextResponse.json({ error: 'El token ha expirado. Por favor, solicita uno nuevo.' }, { status: 400 });
        }

        // Marcar usuario como verificado
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: { emailVerified: true }
        });

        // Eliminar el token usado
        await prisma.emailVerificationToken.delete({ where: { id: verificationToken.id } });

        // Redirigir al usuario al dashboard o login con mensaje de éxito
        // Asumimos que la URL base se puede usar para redirigir 
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/colombia/Login?verified=true`);

    } catch (error) {
        console.error('Error verificando email:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

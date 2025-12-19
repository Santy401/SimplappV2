import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    verifyRefreshToken,
    generateAccessToken,
    generateRefreshToken,
    revokeRefreshToken
} from '@interfaces/lib/auth/token';

/**
 * POST /api/auth/refresh
 * Renueva el access token usando el refresh token
 */
export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh-token')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token provided' },
                { status: 401 }
            );
        }

        // Verifica que el refresh token sea válido
        const tokenData = await verifyRefreshToken(refreshToken);

        if (!tokenData) {
            return NextResponse.json(
                { error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        // Genera un NUEVO access token
        const newAccessToken = await generateAccessToken(
            tokenData.user.id,
            tokenData.user.email
        );

        // OPCIONAL: Rotación de refresh token (más seguro)
        // Revoca el refresh token viejo y crea uno nuevo
        await revokeRefreshToken(refreshToken);
        const newRefreshToken = await generateRefreshToken(tokenData.user.id);

        const response = NextResponse.json({
            message: 'Token refreshed successfully',
            user: {
                id: tokenData.user.id,
                email: tokenData.user.email,
                name: tokenData.user.name,
            },
            accessToken: newAccessToken,
        });

        // Actualiza las cookies
        response.cookies.set('access-token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutos
            path: '/',
        });

        response.cookies.set('refresh-token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 días
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

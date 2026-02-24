import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeRefreshToken } from '@interfaces/lib/auth/token';

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario y revoca el refresh token
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refresh-token')?.value;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Domain para limpiar cookies cross-subdomain
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    const cookieOptions = {
      path: '/',
      ...(cookieDomain && { domain: cookieDomain }),
    };

    const response = NextResponse.json({
      message: 'Logout exitoso'
    });

    response.cookies.delete({ name: 'access-token', ...cookieOptions });
    response.cookies.delete({ name: 'refresh-token', ...cookieOptions });
    response.cookies.delete({ name: 'auth-token', ...cookieOptions });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

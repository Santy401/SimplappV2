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

    cookieStore.delete('access-token');
    cookieStore.delete('refresh-token');

    cookieStore.delete('auth-token');

    return NextResponse.json({
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
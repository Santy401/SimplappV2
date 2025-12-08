import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeRefreshToken } from '@/interfaces/lib/auth/token';

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario y revoca el refresh token
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Obtiene el refresh token antes de borrarlo
    const refreshToken = cookieStore.get('refresh-token')?.value;

    // ✅ REVOCA EL REFRESH TOKEN EN LA BASE DE DATOS
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // ✅ BORRA AMBAS COOKIES
    cookieStore.delete('access-token');
    cookieStore.delete('refresh-token');

    // También borra la cookie vieja por si acaso
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
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/interfaces/lib/auth/token';
import { prisma } from '@/interfaces/lib/prisma';

export interface SessionResponse {
  id: number;
  email: string;
  name: string;
  typeAccount: string;
  country: string;
  companyId?: number;
}

/**
 * GET /api/auth/session
 * Verifica el access token y retorna los datos del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // ✅ VERIFICA QUE EL TOKEN SEA VÁLIDO
    const payload = await verifyAccessToken(accessToken);

    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // ✅ OBTIENE LOS DATOS REALES DEL USUARIO
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData: SessionResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      typeAccount: user.typeAccount,
      country: user.country,
      companyId: user.company?.id,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

export interface SessionResponse {
  id: string;
  email: string;
  name: string;
  typeAccount: string;
  country: string;
  companyId?: string;
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

    const payload = await verifyAccessToken(accessToken) as {id: string};

    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { companies: { include: { company: true } } },
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
      companyId: user.companies?.[0]?.company?.id,
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
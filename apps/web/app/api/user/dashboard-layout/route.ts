import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken) as { id: string };
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { layout } = await request.json();

    if (!layout) {
      return NextResponse.json({ error: 'Layout is required' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: payload.id },
      data: { dashboardLayout: layout },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Dashboard layout save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

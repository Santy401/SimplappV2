import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { logActivity } from '@interfaces/lib/activity-log';
import { getPaginationParams, buildMeta } from '@/lib/pagination';

/**
 * GET /api/clients
 * Obtiene el listado de clientes de la empresa
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken) as { id: string };;
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { companies: { include: { company: true } } },
    });

    if (!user || !user.companies?.[0]?.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const companyId = user.companies[0].company.id;
    const { page, take, skip } = getPaginationParams(request);
    const searchQuery = request.nextUrl.searchParams.get('search') ?? undefined;

    const where = {
      companyId,
      deletedAt: null,
      ...(searchQuery && {
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' as const } },
          { firstLastName: { contains: searchQuery, mode: 'insensitive' as const } },
          { identificationNumber: { contains: searchQuery, mode: 'insensitive' as const } },
          { email: { contains: searchQuery, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [clients, total] = await prisma.$transaction([
      prisma.client.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({ data: clients, meta: buildMeta(page, take, total) });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Crea un nuevo cliente
 */
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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { companies: { include: { company: true } } },
    });

    if (!user || !user.companies?.[0]?.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const data = await request.json();

    const client = await prisma.client.create({
      data: {
        ...data,
        companyId: user.companies[0].company.id,
      },
    });

    void logActivity({
      companyId: user.companies[0].company.id,
      userId: user.id,
      action: 'CREATE',
      entityType: 'Client',
      entityId: client.id,
      changes: client,
      metadata: { source: 'API' },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}
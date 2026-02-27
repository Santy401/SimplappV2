import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { logActivity } from '@interfaces/lib/activity-log';
import { getPaginationParams, buildMeta } from '@/lib/pagination';
import { getAuthContext } from '@interfaces/lib/auth/session';

/**
 * GET /api/clients
 * Obtiene el listado de clientes de la empresa
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { companyId } = auth;
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
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { user, companyId } = auth;

    const data = await request.json();

    const client = await prisma.client.create({
      data: {
        ...data,
        companyId,
      },
    });

    void logActivity({
      companyId,
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
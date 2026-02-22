import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

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

    const clients = await prisma.client.findMany({
      where: {
        companyId: user.companies[0].company.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clients);
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

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { cookies } from 'next/headers'
import { verifyAccessToken } from "@interfaces/lib/auth/token";

/**
 * GET /api/stores
 * Obtiene el listado de bodegas de la empresa
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

    const store = await prisma.store.findMany({
      where: {
        companyId: user.companies[0].company.id,
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stores
 * Crea una nueva bodega
 */
export async function POST(request: NextRequest) {
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

    const data = await request.json();

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre de la bodega es requerido' },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name: data.name.trim(),
        address: data.address?.trim() || null,
        observation: data.observation?.trim() || null,
        company: {
          connect: {
            id: user.companies[0].company.id
          }
        }
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);

    if (error instanceof Error) {
      if (error.message.includes('P2002') || error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Ya existe una bodega con ese nombre en esta compañía' },
          { status: 409 }
        );
      }
      if (error.message.includes('P2003') || error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'La compañía no existe' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error al crear bodega' },
      { status: 500 }
    );
  }
}
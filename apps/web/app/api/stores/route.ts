import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { getAuthContext } from "@interfaces/lib/auth/session";

/**
 * GET /api/stores
 * Obtiene el listado de bodegas de la empresa
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { companyId } = auth;

    const store = await prisma.store.findMany({
      where: {
        companyId,
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
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { companyId } = auth;

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
            id: companyId
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
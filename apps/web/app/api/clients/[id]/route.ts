import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

/**
 * DELETE /api/clients/[id]
 * Elimina un cliente
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const client = await prisma.client.findUnique({
      where: { id: id },
    });

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    if (client.companyId !== user.companies[0].company.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.client.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Cliente eliminado" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      {
        error: 'Error al eliminar cliente',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clients/[id]
 * Actualiza la información de un cliente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const client = await prisma.client.findFirst({
      where: {
        id: id,
        companyId: user.companies[0].company.id
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const data = await request.json();

    const updatedClient = await prisma.client.update({
      where: { id: id },
      data: {
        firstLastName: data.firstLastName?.trim() || client.firstLastName,
        secondLastName: data.secondLastName?.trim() || null,
        firstName: data.firstName?.trim() || client.firstName,
        otherNames: data.otherNames?.trim() || null,
        commercialName: data.commercialName?.trim() || null,
        code: data.code?.trim() || null,
        identificationType: data.identificationType || client.identificationType,
        identificationNumber: data.identificationNumber?.trim() || client.identificationNumber,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        country: data.country?.trim() || null,
        department: data.department?.trim() || null,
        municipality: data.municipality?.trim() || null,
        postalCode: data.postalCode?.trim() || null,
        address: data.address?.trim() || null,
        observations: data.observations?.trim() || null,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('💥 Error updating client:', error);
    return NextResponse.json(
      {
        error: 'Error al actualizar cliente',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

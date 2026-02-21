import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@interfaces/lib/auth/token";

/**
 * PUT /api/sellers/[id]
 * Actualiza la información de un vendedor
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken) as { id: string };
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { companies: { include: { company: true } } },
    });

    if (!user || !user.companies?.[0]?.company) {
      return NextResponse.json(
        { error: "User or company not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    const existingSeller = await prisma.seller.findFirst({
      where: {
        id: id,
        companyId: user.companies[0].company.id,
      },
    });

    if (!existingSeller) {
      return NextResponse.json(
        { error: "Vendedor no encontrado" },
        { status: 404 }
      );
    }

    if (data.name && (typeof data.name !== "string" || data.name.trim() === "")) {
      return NextResponse.json(
        { error: "El nombre del vendedor no puede estar vacío" },
        { status: 400 }
      );
    }

    console.log('🔄 Actualizando vendedor...');

    const updatedSeller = await prisma.seller.update({
      where: { id: id },
      data: {
        name: data.name?.trim() || existingSeller.name,
        identification: data.identification?.trim() || null,
        observation: data.observation?.trim() || null,
      },
    });

    console.log('✅ Vendedor actualizado:', updatedSeller);

    return NextResponse.json(updatedSeller);
  } catch (error) {
    console.error("💥 Error updating seller:", error);

    if (error instanceof Error) {
      console.error("💥 Error message:", error.message);

      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "Ya existe un vendedor con esos datos" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Error al actualizar el vendedor",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sellers/[id]
 * Elimina un vendedor
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      );
    }

    await prisma.seller.delete({
      where: {
        id: id,
        companyId: user.companies[0].company.id,
      },
    });

    console.log('✅ Seller eliminado');

    return NextResponse.json({
      message: 'Vendedor eliminado exitosamente'
    });

  } catch (error: any) {
    console.error('💥 Error deleting seller:', error);

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'No se puede eliminar el vendedor porque tiene registros asociados (facturas)' },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vendedor no encontrado' },
        { status: 404 }
      );
    }

    if (error.code === 'P2014') {
      return NextResponse.json(
        { error: 'Violación de restricción de clave foránea' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar el vendedor', details: error.message },
      { status: 500 }
    );
  }
}

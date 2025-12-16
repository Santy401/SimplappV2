import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@interfaces/lib/auth/token";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieSeller = await cookies();
    const accessToken = cookieSeller.get("access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json(
        { error: "User or company not found" },
        { status: 404 }
      );
    }

    const data = await request.json();
    const sellerId = parseInt(id, 10);

    if (isNaN(sellerId)) {
      return NextResponse.json(
        { error: "ID de vendedor inválido" },
        { status: 400 }
      );
    }

    const existingSeller = await prisma.seller.findFirst({
      where: {
        id: sellerId,
        companyId: user.company.id,
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

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        name: data.name?.trim() || existingSeller.name,
        identification: data.identification?.trim() || null,
        observation: data.observation?.trim() || null,
      },
    });

    return NextResponse.json(updatedSeller);
  } catch (error) {
    console.error("Error updating seller:", error);

    if (error instanceof Error) {
      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "Ya existe un vendedor con esos datos" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al actualizar el vendedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieSeller = await cookies();
    const accessToken = cookieSeller.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      );
    }

    await prisma.seller.delete({
      where: {
        id: Number(id),
        companyId: user.company.id,
      },
    });

    return NextResponse.json({
      message: 'Vendedor eliminado exitosamente'
    });

  } catch (error: any) {
    console.error('Error deleting seller:', error);

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
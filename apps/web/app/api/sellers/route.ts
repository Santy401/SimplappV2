import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { getPaginationParams, buildMeta } from '@/lib/pagination';
import { getAuthContext } from "@interfaces/lib/auth/session";


/**
 * GET /api/sellers
 * Obtiene el listado de vendedores de la empresa
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
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' as const } },
          { identification: { contains: searchQuery, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [sellers, total] = await prisma.$transaction([
      prisma.seller.findMany({ where, skip, take }),
      prisma.seller.count({ where }),
    ]);

    return NextResponse.json({ data: sellers, meta: buildMeta(page, take, total) });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json(
      { error: 'Error al obtener Vendedores' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sellers
 * Crea un nuevo vendedor
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { companyId } = auth;

    const data = await request.json();

    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del vendedor es requerido" },
        { status: 400 }
      );
    }

    const seller = await prisma.seller.create({
      data: {
        name: data.name.trim(),
        identification: data.identification?.trim() || null,
        observation: data.observation?.trim() || null,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });


    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error("Error creating seller:", error);

    if (error instanceof Error) {
      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "Ya existe un vendedor con esos datos" },
          { status: 409 }
        );
      }
      if (error.message.includes("P2003")) {
        return NextResponse.json(
          { error: "La compañía no existe" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al crear vendedor" },
      { status: 500 }
    );
  }
}

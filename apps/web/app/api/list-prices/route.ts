import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@interfaces/lib/auth/token";
import { TypePrice } from "@domain/entities/ListPrice.entity";

/**
 * GET /api/list-prices
 * Obtiene el listado de listas de precios de la empresa
 */
export async function GET(request: NextRequest) {
  try {
    const cookieListPrice = await cookies();
    const accessToken = cookieListPrice.get("access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = (await verifyAccessToken(accessToken)) as { id: string };
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json(
        { error: "User or company not found" },
        { status: 404 },
      );
    }

    const listPrices = await prisma.listPrice.findMany({
      where: {
        companyId: user.company.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listPrices);
  } catch (error) {
    console.error("Error fetching list prices:", error);
    return NextResponse.json(
      { error: "Error al obtener Listas de Precios" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/list-prices
 * Crea una nueva lista de precios
 */
export async function POST(request: NextRequest) {
  try {
    const cookieListPrice = await cookies();
    const accessToken = cookieListPrice.get("access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = (await verifyAccessToken(accessToken)) as { id: string };
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json(
        { error: "User or company not found" },
        { status: 404 },
      );
    }

    const data = await request.json();

    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim() === ""
    ) {
      return NextResponse.json(
        { error: "El nombre de la lista de precios es requerido" },
        { status: 400 },
      );
    }

    if (!data.type || !Object.values(TypePrice).includes(data.type)) {
      return NextResponse.json(
        { error: "Tipo de lista de precios inválido" },
        { status: 400 },
      );
    }

    if (data.type !== TypePrice.PORCENTAJE) {
      data.percentage = null;
    }

    if (data.type === "PORCENTAJE") {
      if (!data.percentage || data.percentage.trim() === "") {
        return NextResponse.json(
          { error: "El porcentaje es requerido para tipo Porcentaje" },
          { status: 400 },
        );
      }
      data.percentage = String(data.percentage);
    }

    if (data.type === TypePrice.PORCENTAJE) {
      const percentage = Number(data.percentage);

      if (isNaN(percentage) || percentage <= 0) {
        return NextResponse.json(
          { error: "El porcentaje debe ser un número mayor a 0" },
          { status: 400 },
        );
      }

      data.percentage = String(percentage);
    }

    const listPrice = await prisma.listPrice.create({
      data: {
        name: data.name.trim(),
        type: data.type,
        percentage: data.type === TypePrice.PORCENTAJE ? String(data.percentage) : null,
        description: data.description?.trim() || null,
        company: {
          connect: {
            id: user.company.id,
          },
        },
      },
    });

    return NextResponse.json(listPrice, { status: 201 });
  } catch (error) {
    console.error("Error creating list price:", error);

    if (error instanceof Error) {
      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "Ya existe una lista de precios con ese nombre" },
          { status: 409 },
        );
      }
      if (error.message.includes("P2003")) {
        return NextResponse.json(
          { error: "La compañía no existe" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: "Error al crear lista de precios" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@interfaces/lib/auth/token";

export async function GET(request: NextRequest) {
  try {
    const cookieSeller = await cookies();
    const accessToken = cookieSeller.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const seller = await prisma.seller.findMany({
      where: {
        companyId: user.company.id,
      }
    });

    return NextResponse.json(seller);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json(
      { error: 'Error al obtener Vendedores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

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
            id: user.company.id,
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

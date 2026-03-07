import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { getAuthContext } from "@interfaces/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const payments = await prisma.payment.findMany({
      where: {
        bill: {
          companyId: auth.companyId,
        },
      },
      include: {
        bill: {
          select: {
            prefix: true,
            number: true,
            clientName: true,
            items: {
              select: { id: true },
            },
          },
        },
        account: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Error al obtener los pagos" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { getAuthContext } from "@interfaces/lib/auth/session";
import { z } from "zod";
import { BankAccountType } from "@prisma/client";

const bankAccountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.nativeEnum(BankAccountType).default(BankAccountType.CASH),
  currency: z.string().default("COP"),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const accounts = await prisma.bankAccount.findMany({
      where: { companyId: auth.companyId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: accounts });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return NextResponse.json({ error: "Error al obtener las cuentas bancarias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await request.json();
    const result = bankAccountSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, type, currency, description } = result.data;

    const newAccount = await prisma.bankAccount.create({
      data: {
        companyId: auth.companyId,
        name,
        type,
        currency,
        description,
        balance: 0,
      },
    });

    return NextResponse.json({ data: newAccount }, { status: 201 });
  } catch (error) {
    console.error("Error creating bank account:", error);
    return NextResponse.json({ error: "Error al crear la cuenta bancaria" }, { status: 500 });
  }
}

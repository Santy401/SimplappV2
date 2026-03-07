import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { getAuthContext } from "@interfaces/lib/auth/session";
import { z } from "zod";
import { BankAccountType } from "@prisma/client";

const bankAccountUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  type: z.nativeEnum(BankAccountType).optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  balance: z.number().optional(),
  active: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext();
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const account = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!account || account.companyId !== auth.companyId || account.deletedAt !== null) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const result = bankAccountUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ data: updatedAccount });
  } catch (error) {
    console.error("Error updating bank account:", error);
    return NextResponse.json({ error: "Error al actualizar la cuenta bancaria" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext();
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;

    const account = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!account || account.companyId !== auth.companyId || account.deletedAt !== null) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
    }

    // Soft delete
    await prisma.bankAccount.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });

    return NextResponse.json({ success: true, message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return NextResponse.json({ error: "Error al eliminar la cuenta bancaria" }, { status: 500 });
  }
}

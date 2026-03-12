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

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await request.json();
    const {
      clientId,
      bankAccountId,
      paymentDate,
      paymentMethod,
      invoicePayments,
      notes
    } = body;

    if (!clientId || !bankAccountId || !paymentMethod || !invoicePayments || invoicePayments.length === 0) {
      return NextResponse.json({ error: "Faltan datos obligatorios para el recibo" }, { status: 400 });
    }

    // Generate a simple receiptNumber logic
    const countPayments = await prisma.payment.count({
      where: { bill: { companyId: auth.companyId } }
    });
    const receiptNumber = String(countPayments + 1).padStart(4, "0");

    await prisma.$transaction(async (tx: any) => {
      for (const ip of invoicePayments) {
        if (!ip.amount || ip.amount <= 0) continue;

        const bill = await tx.bill.findUnique({
          where: { id: ip.billId }
        });
        if (!bill) continue;

        await tx.payment.create({
          data: {
            billId: ip.billId,
            accountId: bankAccountId,
            amount: ip.amount,
            method: paymentMethod,
            date: paymentDate ? new Date(paymentDate) : new Date(),
            notes: notes || null,
            receiptNumber
          }
        });

        const newBalance = Math.max(0, Number(bill.balance) - ip.amount);
        let status = bill.status;
        if (newBalance <= 0) {
          status = "PAID";
        } else if (newBalance < Number(bill.total)) {
          status = "PARTIALLY_PAID";
        }

        await tx.bill.update({
          where: { id: bill.id },
          data: {
            balance: String(newBalance),
            status: status
          }
        });
      }
    });

    return NextResponse.json({ success: true, receiptNumber }, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Error al registrar el pago de factura(s)" }, { status: 500 });
  }
}

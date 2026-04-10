import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { PaymentMethod, BillStatus, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = require('pg') as { Pool: new (config: { connectionString: string }) => any };

declare global {
  // eslint-disable-next-line no-var
  var __prismaPayments: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
};

const prisma = global.__prismaPayments ?? (global.__prismaPayments = createPrismaClient());

export async function POST(
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

    const { id: billId } = await params;

    const data = await request.json();
    const paymentValue = Number(data.value) || 0;

    if (paymentValue <= 0) {
      return NextResponse.json({ error: 'El valor del pago debe ser mayor a 0' }, { status: 400 });
    }

    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.companies[0].company.id,
      },
      include: {
        payments: true
      }
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    const currentBalance = Number(bill.balance);
    const newBalance = currentBalance - paymentValue;

    if (newBalance < 0) {
      return NextResponse.json({ error: 'El monto del pago no puede exceder el balance actual.' }, { status: 400 });
    }

    let prismaPaymentMethod: PaymentMethod = PaymentMethod.UNDEFINED;
    const incomingMethod = data.paymentMethod?.toUpperCase();
    
    if (incomingMethod === 'CASH' || incomingMethod === 'EFECTIVO') prismaPaymentMethod = PaymentMethod.CASH;
    else if (incomingMethod === 'TRANSFER' || incomingMethod === 'TRANSFERENCIA') prismaPaymentMethod = PaymentMethod.TRANSFER;
    else if (incomingMethod === 'CREDIT_CARD' || incomingMethod === 'TARJETA') prismaPaymentMethod = PaymentMethod.CREDIT_CARD;
    else if (incomingMethod === 'DEBIT_CARD') prismaPaymentMethod = PaymentMethod.DEBIT_CARD;
    else if (incomingMethod === 'CHECK') prismaPaymentMethod = PaymentMethod.CHECK;
    else if (Object.values(PaymentMethod).includes(incomingMethod)) {
      prismaPaymentMethod = incomingMethod as PaymentMethod;
    }

    const newStatus = (newBalance <= 0) ? BillStatus.PAID : BillStatus.PARTIALLY_PAID;

    if (data.bankAccount) {
      const accountExists = await prisma.bankAccount.findUnique({
        where: { id: data.bankAccount }
      });
      if (!accountExists) {
        return NextResponse.json({ error: 'La cuenta bancaria no existe' }, { status: 400 });
      }
    }

    const transaction = await prisma.$transaction([
      prisma.payment.create({
        data: {
          billId: bill.id,
          amount: paymentValue,
          method: prismaPaymentMethod,
          date: new Date(data.date || new Date().toISOString()),
          accountId: data.bankAccount && data.bankAccount !== "" ? data.bankAccount : undefined,
        }
      }),
      prisma.bill.update({
        where: { id: bill.id },
        data: {
          balance: newBalance,
          paidTotal: { increment: paymentValue },
          status: newStatus,
          updatedAt: new Date()
        }
      }),
      prisma.activityLog.create({
        data: {
          companyId: user.companies[0].company.id,
          userId: user.id,
          action: 'PAYMENT_ADDED',
          entityType: 'Bill',
          entityId: bill.id,
          metadata: { amount: paymentValue, method: data.paymentMethod },
          changes: { oldBalance: currentBalance, newBalance }
        }
      })
    ]);

    return NextResponse.json({ success: true, bill: transaction[1] });
  } catch (error) {
    console.error('[Payment Error]:', error);
    return NextResponse.json(
      { error: 'Error interno registrando el pago' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { id: billId } = await params;
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId es requerido' }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        billId: billId
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }

    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.companies[0].company.id,
      }
    });

    if (!bill) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }

    const currentBalance = Number(bill.balance);
    const newBalance = currentBalance + Number(payment.amount);

    let newStatus: BillStatus;
    if (newBalance >= Number(bill.total) - Number(bill.appliedCreditNoteTotal || 0)) {
      newStatus = BillStatus.TO_PAY;
    } else if (newBalance > 0) {
      newStatus = BillStatus.PARTIALLY_PAID;
    } else {
      newStatus = BillStatus.PAID;
    }

    await prisma.$transaction([
      prisma.payment.delete({
        where: { id: paymentId }
      }),
      prisma.bill.update({
        where: { id: billId },
        data: {
          balance: newBalance,
          paidTotal: { decrement: Number(payment.amount) },
          status: newStatus,
          updatedAt: new Date()
        }
      }),
      prisma.activityLog.create({
        data: {
          companyId: user.companies[0].company.id,
          userId: user.id,
          action: 'PAYMENT_DELETED',
          entityType: 'Bill',
          entityId: billId,
          metadata: { amount: Number(payment.amount), method: payment.method },
          changes: { oldBalance: currentBalance, newBalance }
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Pago eliminado correctamente',
      newBalance 
    });
  } catch (error) {
    console.error('[Payment Delete Error]:', error);
    return NextResponse.json(
      { error: 'Error interno eliminando el pago' },
      { status: 500 }
    );
  }
}

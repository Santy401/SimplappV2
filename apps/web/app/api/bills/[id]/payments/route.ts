import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { PaymentMethod, BillStatus } from '@prisma/client';

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

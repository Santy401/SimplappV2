import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { BillStatus } from '@prisma/client';
import { getPaginationParams, buildMeta } from '@/lib/pagination';
import { createNotification } from '@/lib/notify';

import { getAuthContext } from '@interfaces/lib/auth/session';

/**
 * GET /api/bills
 * Obtiene el listado de facturas con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { companyId } = auth;
    const { searchParams } = new URL(request.url);
    const { page, take, skip } = getPaginationParams(request);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = {
      companyId,
      deletedAt: null,
    };

    if (clientId) whereClause.clientId = clientId;
    if (status) whereClause.status = status as BillStatus;

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    }

    const include = {
      client: true,
      store: true,
      user: true,
      items: { include: { product: true } },
      payments: { include: { account: true } },
      creditNotes: {
        where: { status: { in: ['APPLIED', 'ISSUED'] } },
        select: { id: true, number: true, total: true, status: true, type: true, date: true }
      },
    };

    const [bills, total] = await prisma.$transaction([
      prisma.bill.findMany({ where: whereClause, include, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.bill.count({ where: whereClause }),
    ]);

    return NextResponse.json({ data: bills, meta: buildMeta(page, take, total) });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { error: 'Error al obtener facturas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bills
 * Crea una nueva factura
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { user, companyId } = auth;

    const data = await request.json();
    const {
      clientId,
      storeId,
      items,
      date,
      dueDate,
      status = 'DRAFT',
      paymentMethod,
      subtotal,
      taxTotal,
      discountTotal,
      total,
      balance,
      notes
    } = data;

    // Si el usuario nos pasa items, pero son un array vacio de Drafts o sin validar cantdades, los limpia.
    const validItems = items?.filter((item: { productId: string }) => item.productId) || [];

    if (!clientId || !date || (status !== 'DRAFT' && (!validItems || validItems.length === 0 || !subtotal || !total))) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: clientId, items, date, subtotal, total' },
        { status: 400 }
      );
    }

    let nextNumber = 0;
    if (status !== 'DRAFT') {
      const lastBill = await prisma.bill.findFirst({
        where: {
          companyId,
          number: { gt: 0 },
          OR: [
            { deletedAt: null },
            { deletedAt: { not: null } }
          ]
        },
        orderBy: {
          number: 'desc'
        }
      });
      nextNumber = (lastBill?.number ?? 0) + 1;
    } else {
      const lastDraft = await prisma.bill.findFirst({
        where: {
          companyId,
          number: { lte: 0 },
          OR: [
            { deletedAt: null },
            { deletedAt: { not: null } }
          ]
        },
        orderBy: {
          number: 'asc'
        }
      });
      nextNumber = (lastDraft?.number ?? 0) - 1;
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // 🧑‍🏫 MENTOR FIX: Lógica de negocio comercial firme para el estado y balance
    let finalStatus = status as BillStatus;
    const finalPaymentMethod = paymentMethod || 'CASH';
    
    // Fix: Si envían un 0 real para balance, que no lo sobreescriba a truthy (total)
    const rawBalance = balance !== undefined ? Number(balance) : Number(total || 0);
    let finalBalance = rawBalance;

    if (finalStatus !== 'DRAFT') {
      if (finalPaymentMethod === 'CREDIT') {
        // Toda factura a crédito comercialmente es por pagar al 100% al inicio
        finalStatus = 'TO_PAY';
        finalBalance = Number(total);
      } else if (finalStatus === 'PAID') {
        // En pago completo, saldo cobrable es 0
        finalBalance = 0;
      } else if (finalStatus === 'ISSUED' && finalBalance === 0) {
         // Si la emiten con saldo cero a contado, automáticamente es pagada
         finalStatus = 'PAID';
      }
    }

    const billData: Record<string, unknown> = {
      number: nextNumber,
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : new Date(date),
      status: finalStatus,
      paymentMethod: finalPaymentMethod,

      subtotal: String(subtotal ?? 0),
      taxTotal: String(taxTotal ?? 0),
      discountTotal: String(discountTotal ?? 0),
      total: String(total ?? 0),
      balance: String(finalBalance),

      notes: notes || "",

      clientName: `${client.firstName} ${client.firstLastName}`,
      clientIdentification: client.identificationNumber,
      clientAddress: client.address,
      clientPhone: client.phone,
      clientEmail: client.email,

      user: { connect: { id: user.id } },
      company: { connect: { id: companyId } },
      client: { connect: { id: String(clientId) } },

      items: {
        create: validItems.map((item: { productId: string, quantity: number, price: string, subtotal: string, total: string, taxRate: string, taxAmount: string, discount: string, productName: string, name: string }) => ({
          productId: String(item.productId),
          quantity: Number(item.quantity) || 1,
          price: String(item.price || 0),
          subtotal: String(item.subtotal || item.total || 0),
          total: String(item.total || 0),
          taxRate: String(item.taxRate || 0),
          taxAmount: String(item.taxAmount || 0),
          discount: String(item.discount || 0),
          productName: item.productName || item.name || "",
        }))
      }
    };

    if (storeId) {
      const store = await prisma.store.findUnique({
        where: { id: storeId }
      });

      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }

      billData.store = { connect: { id: String(storeId) } };
    } else {
      let defaultStore = await prisma.store.findFirst({
        where: {
          companyId,
        },
      });

      if (!defaultStore) {
        defaultStore = await prisma.store.create({
          data: {
            name: "Principal",
            companyId
          }
        });
      }

      billData.store = { connect: { id: defaultStore.id } };
    }

    const bill = await prisma.bill.create({
      data: billData,
      include: {
        items: true,
        client: true,
        store: true,
      }
    });

    // 🔔 Notificación de factura creada — usamos bill.status real, no el del body
    if (bill.status === 'DRAFT') {
      // 🧑‍🏫 Spam eliminado: No notificamos borradores creados.
      /* void createNotification({
        userId: user.id,
        companyId,
        title: 'Borrador de factura guardado',
        message: `Se guardó un borrador de factura para ${client.firstName} ${client.firstLastName}.`,
        type: 'INFO',
        link: 'Sales/Bills',
      }); */
    } else {
      const statusLabels: Record<string, string> = {
        ISSUED: 'emitida',
        TO_PAY: 'por pagar',
        PAID: 'pagada',
        PARTIALLY_PAID: 'pago parcial',
      };
      const label = statusLabels[bill.status] ?? bill.status.toLowerCase();
      void createNotification({
        userId: user.id,
        companyId,
        title: 'Factura creada exitosamente',
        message: `Se creó la factura (${label}) para ${client.firstName} ${client.firstLastName} por $${total}.`,
        type: 'SUCCESS',
        link: 'Sales/Bills',
      });
    }

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { error: 'Error al crear factura' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { BillStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken) as {id: string};;
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    // Opcional: obtener parámetros de query para filtrar
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = {
      companyId: user.company.id,
    };

    if (clientId) {
      whereClause.clientId = clientId;
    }

    if (status) {
      whereClause.status = status as BillStatus;
    }

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    const bills = await prisma.bill.findMany({
      where: whereClause,
      include: {
        client: true,
        store: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { error: 'Error al obtener facturas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken) as {id: string};;
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const data = await request.json();
    const {
      clientId,
      storeId, // Puede ser undefined/null si no se proporciona
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

    // Validaciones requeridas
    if (!clientId || !items || items.length === 0 || !date || !subtotal || !total) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: clientId, items, date, subtotal, total' },
        { status: 400 }
      );
    }

    // Calculate next number
    const lastBill = await prisma.bill.findFirst({
      where: {
        companyId: user.company.id,
      },
      orderBy: {
        number: 'desc'
      }
    });

    const nextNumber = (lastBill?.number ?? 0) + 1;

    // We need to fetch client details for snapshot
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Opción 1: Si storeId es requerido, validar que exista
    if (!storeId) {
      // Si store es opcional en tu schema, omítelo completamente
      // Si es requerido, devuelve error
      // return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    // Crear objeto de datos base
    const billData: any = {
      number: nextNumber,
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status as BillStatus,
      paymentMethod: paymentMethod,

      subtotal: String(subtotal),
      taxTotal: String(taxTotal || 0),
      discountTotal: String(discountTotal || 0),
      total: String(total),
      balance: String(balance || total),

      notes: notes,

      // Snapshot
      clientName: `${client.firstName} ${client.firstLastName}`,
      clientIdentification: client.identificationNumber,
      clientAddress: client.address,
      clientPhone: client.phone,
      clientEmail: client.email,

      // Relations
      user: { connect: { id: user.id } },
      company: { connect: { id: user.company.id } },
      client: { connect: { id: String(clientId) } },

      items: {
        create: items.map((item: any) => ({
          productId: String(item.productId),
          quantity: Number(item.quantity),
          price: String(item.price),
          total: String(item.total),
          taxRate: String(item.taxRate || 0),
          taxAmount: String(item.taxAmount || 0),
          discount: String(item.discount || 0),
          productName: item.productName,
        }))
      }
    };

    // Opción 2: Manejar storeId condicionalmente
    if (storeId) {
      // Verificar que la store exista
      const store = await prisma.store.findUnique({
        where: { id: storeId }
      });

      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }

      billData.store = { connect: { id: Number(storeId) } };
    } else {
      // Si store no es requerido, puedes conectar a una store por defecto
      // o dejar que Prisma use el valor por defecto del schema
      // Por ejemplo, buscar la primera store de la compañía
      const defaultStore = await prisma.store.findFirst({
        where: {
          companyId: user.company.id,
        },
      });

      if (defaultStore) {
        billData.store = { connect: { id: defaultStore.id } };
      }
      // Si no hay store y no es requerido, simplemente no incluyas el campo
    }

    const bill = await prisma.bill.create({
      data: billData,
      include: {
        items: true,
        client: true,
        store: true,
      }
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { error: 'Error al crear factura' },
      { status: 500 }
    );
  }
}
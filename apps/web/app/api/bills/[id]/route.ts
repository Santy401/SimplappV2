import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

/**
 * GET /api/bills/[id]
 * Obtiene una factura específica por su ID
 */
export async function GET(
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
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const { id } = await params;
    const billId = id;

    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.company.id,
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        client: true,
        store: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    return NextResponse.json(
      { error: 'Error al obtener factura' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bills/[id]
 * Actualiza una factura existente
 */
export async function PUT(
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
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const { id } = await params;
    const billId = id;

    const existingBill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.company.id,
      },
    });

    if (!existingBill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    if (existingBill.status === 'ISSUED') {
      return NextResponse.json(
        { error: 'No se puede editar una factura emitida.' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const {
      items,
      id: _id,
      companyId: _companyId,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      userId: _userId,
      storeId: _storeId,
      client: _client,
      user: _user,
      company: _company,
      store: _store,
      ...billData
    } = data;

    const cleanItems = items?.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: String(item.price),
      total: String(item.total),
      taxRate: String(item.taxRate || 0),
      taxAmount: String(item.taxAmount || 0),
      discount: String(item.discount || 0),
      productName: item.productName || item.name || "",
      productCode: item.productCode || item.reference || "",
    })) || [];

    const result = await prisma.$transaction(async (tx) => {
      await tx.billItem.deleteMany({
        where: { billId: billId }
      });

      const updatedBill = await tx.bill.update({
        where: { id: billId },
        data: {
          ...billData,
          ...(data.clientId ? { clientId: data.clientId } : {}),
          ...(data.storeId ? { storeId: data.storeId } : {}),
          items: {
            create: cleanItems
          }
        },
        include: {
          items: true
        }
      });

      return updatedBill;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { error: 'Error al actualizar factura' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bills/[id]
 * Elimina una factura
 */
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
      include: { company: true },
    });

    if (!user || !user.company) {
      return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
    }

    const { id } = await params;
    const billId = id;

    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.company.id,
      },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    if (bill.status === 'ISSUED') {
      return NextResponse.json(
        { error: 'No se puede eliminar una factura emitida. Debe realizar una nota de crédito o cambiar su estado.' },
        { status: 400 }
      );
    }

    await prisma.billItem.deleteMany({
      where: { billId },
    });

    await prisma.bill.delete({
      where: { id: billId },
    });

    return NextResponse.json({
      success: true,
      message: 'Factura eliminada correctamente'
    });
  } catch (error) {
    console.error('Error deleting bill:', error);

    return NextResponse.json(
      { error: 'Error al eliminar factura' },
      { status: 500 }
    );
  }
}

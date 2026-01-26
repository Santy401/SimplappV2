import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

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

    const { id } = await params;
    const billId = parseInt(id);
    
    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    // Obtener factura con items y relaciones
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

    const { id } = await params;
    const billId = parseInt(id);
    
    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    // Verificar si la factura existe
    const existingBill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.company.id,
      },
    });

    if (!existingBill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    const data = await request.json();

    // Actualizar factura
    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: {
        ...data,
        // Asegurar que companyId permanezca igual
        companyId: user.company.id,
      },
    });

    return NextResponse.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { error: 'Error al actualizar factura' },
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

    const { id } = await params;
    const billId = parseInt(id);
    
    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    // Verificar si la factura existe
    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        companyId: user.company.id,
      },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // Primero eliminar los items relacionados
    await prisma.billItem.deleteMany({
      where: { billId: billId },
    });

    // Luego eliminar la factura
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
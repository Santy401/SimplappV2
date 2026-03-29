import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@interfaces/lib/auth/session';
import { CreditNoteService } from '@simplapp/interfaces/services/credit-note.service';
import { CreditNoteStatus, CreditNoteType, CreditNoteReason, CreateCreditNoteInput } from '@domain/entities/CreditNote.entity';
import { getPaginationParams, buildMeta } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { companyId } = auth;
    const { searchParams } = new URL(request.url);
    const { page, take, skip } = getPaginationParams(request);
    const billId = searchParams.get('billId');
    const status = searchParams.get('status') as CreditNoteStatus | null;

    const result = await CreditNoteService.findAll(companyId, {
      skip,
      take,
      billId: billId || undefined,
      status: status || undefined
    });

    return NextResponse.json({
      data: result.data,
      meta: buildMeta(page, take, result.total)
    });
  } catch (error) {
    console.error('Error fetching credit notes:', error);
    return NextResponse.json(
      { error: 'Error al obtener notas de crédito' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
    }

    const { user, companyId } = auth;

    const data = await request.json();
    const {
      billId,
      type,
      reason,
      date,
      notes,
      items,
      status
    } = data;

    if (!billId || !type || !reason || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: billId, type, reason, items' },
        { status: 400 }
      );
    }

    const validItems = items.filter((item: { billItemId: string }) => item.billItemId);
    if (validItems.length === 0) {
      return NextResponse.json(
        { error: 'Debe incluir al menos un ítem válido' },
        { status: 400 }
      );
    }

    const input: CreateCreditNoteInput = {
      billId,
      type: type as CreditNoteType,
      reason: reason as CreditNoteReason,
      date: date ? new Date(date) : undefined,
      notes: notes || undefined,
      items: validItems.map((item: any) => ({
        billItemId: item.billItemId,
        quantity: Number(item.quantity) || 1,
        price: String(item.price || 0),
        subtotal: String(item.subtotal || item.total || 0),
        taxRate: String(item.taxRate || 0),
        taxAmount: String(item.taxAmount || 0),
        discount: String(item.discount || 0),
        total: String(item.total || 0),
        productName: item.productName,
        productCode: item.productCode
      })),
      status: status as CreditNoteStatus
    };

    const creditNote = await CreditNoteService.create(input, user.id, companyId);

    return NextResponse.json(creditNote, { status: 201 });
  } catch (error) {
    console.error('Error creating credit note:', error);
    const message = error instanceof Error ? error.message : 'Error al crear nota de crédito';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

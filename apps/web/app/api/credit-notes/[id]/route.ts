import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@interfaces/lib/auth/session';
import { CreditNoteService } from '@simplapp/interfaces/services/credit-note.service';
import { CreditNoteStatus } from '@domain/entities/CreditNote.entity';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const creditNote = await CreditNoteService.findById(id, auth.companyId);

    if (!creditNote) {
      return NextResponse.json({ error: 'Nota de crédito no encontrada' }, { status: 404 });
    }

    return NextResponse.json(creditNote);
  } catch (error) {
    console.error('Error fetching credit note:', error);
    return NextResponse.json(
      { error: 'Error al obtener nota de crédito' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    
    const creditNote = await CreditNoteService.cancel(id, auth.companyId);

    return NextResponse.json(creditNote);
  } catch (error) {
    console.error('Error cancelling credit note:', error);
    const message = error instanceof Error ? error.message : 'Error al cancelar nota de crédito';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

"use client";

import { TableActionsDropdown } from "../../molecules/TableActionsDropdown";
import { CreditNoteStatus, CreditNoteType } from "@domain/entities/CreditNote.entity";
import { FileText, X } from "lucide-react";

interface CreditNoteWithRelations {
    id: string;
    billId: string;
    number: number;
    prefix?: string | null;
    legalNumber?: string | null;
    status: CreditNoteStatus;
    type: CreditNoteType;
    date: Date;
    total: string;
    notes?: string | null;
    bill?: {
        clientName?: string | null;
        number?: number;
    };
}

export const createColumns = (
    handleView: (creditNote: CreditNoteWithRelations) => void,
    handleCancel: (creditNote: CreditNoteWithRelations) => Promise<void>
) => {
    return [
        {
            key: "number",
            header: "Número",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span className="font-medium">
                    {creditNote.prefix || 'NC'}-{creditNote.number}
                </span>
            ),
        },
        {
            key: "bill",
            header: "Factura",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span className="text-muted-foreground">
                    #{creditNote.bill?.number || creditNote.billId}
                </span>
            ),
        },
        {
            key: "client",
            header: "Cliente",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span>{creditNote.bill?.clientName || '-'}</span>
            ),
        },
        {
            key: "type",
            header: "Tipo",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${creditNote.type === 'RETURN' ? 'bg-blue-100 text-blue-700' :
                        creditNote.type === 'DISCOUNT' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'}`}>
                    {creditNote.type === 'RETURN' ? 'Devolución' :
                        creditNote.type === 'DISCOUNT' ? 'Descuento' :
                            'Ajuste'}
                </span>
            ),
        },
        {
            key: "date",
            header: "Fecha",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span className="text-muted-foreground">
                    {new Date(creditNote.date).toLocaleDateString('es-CO')}
                </span>
            ),
        },
        {
            key: "total",
            header: "Total",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span className="font-medium text-red-600">
                    ${Number(creditNote.total).toLocaleString('es-CO')}
                </span>
            ),
        },
        {
            key: "status",
            header: "Estado",
            cell: (creditNote: CreditNoteWithRelations) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${creditNote.status === 'APPLIED' ? 'bg-green-100 text-green-700' :
                        creditNote.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                            creditNote.status === 'ISSUED' ? 'bg-blue-100 text-blue-700' :
                                creditNote.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                    creditNote.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                                        'bg-slate-100 text-slate-700'}`}>
                    {creditNote.status === 'APPLIED' ? 'Aplicada' :
                        creditNote.status === 'DRAFT' ? 'Borrador' :
                            creditNote.status === 'ISSUED' ? 'Emitida' :
                                creditNote.status === 'CANCELLED' ? 'Cancelada' :
                                    creditNote.status === 'REJECTED' ? 'Rechazada' :
                                        creditNote.status}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (creditNote: CreditNoteWithRelations) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleView(creditNote); }}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Ver detalle"
                    >
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    {creditNote.status === CreditNoteStatus.DRAFT && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCancel(creditNote); }}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                            title="Cancelar"
                        >
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    )}
                </div>
            ),
        }
    ];
};

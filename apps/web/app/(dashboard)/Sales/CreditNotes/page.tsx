"use client";

import { useState, useMemo, useCallback } from 'react';
import { Receipt, FileText, Plus, CreditCard, RotateCcw, Percent, DollarSign } from 'lucide-react';
import { ModernTable, ModernTableSkeleton } from '@simplapp/ui';
import type { TableColumn } from '@simplapp/ui/src/types/table.entity';
import { useCreditNote } from '@interfaces/src/hooks/features/CreditNotes';
import { useBill } from '@interfaces/src/hooks/features/Bills/useBill';
import { toast } from 'react-toastify';
import { CreditNoteStatus, CreditNoteType, CreditNoteReason, CreateCreditNoteInput } from '@domain/entities/CreditNote.entity';

interface CreditNoteWithRelations {
    id: string;
    billId: string;
    number: number;
    prefix?: string | null;
    legalNumber?: string | null;
    status: CreditNoteStatus;
    type: CreditNoteType;
    reason: CreditNoteReason;
    date: Date;
    subtotal: string;
    taxTotal: string;
    discountTotal: string;
    total: string;
    notes?: string | null;
    bill?: {
        id: string;
        number: number;
        prefix?: string | null;
        clientName?: string | null;
        clientIdentification?: string | null;
        items?: any[];
    };
    items?: any[];
    createdAt?: Date;
}

interface CreditNoteDetailProps {
    creditNote: CreditNoteWithRelations;
    onClose: () => void;
    onCancel: (cn: CreditNoteWithRelations) => Promise<void>;
    isCancelling: boolean;
}

function CreditNoteDetail({ creditNote, onClose, onCancel, isCancelling }: CreditNoteDetailProps) {
    const typeLabels: Record<CreditNoteType, string> = {
        RETURN: 'Devolución',
        DISCOUNT: 'Descuento',
        PRICE_ADJUSTMENT: 'Ajuste de Precio'
    };

    const reasonLabels: Record<CreditNoteReason, string> = {
        DEVOLUCION_PARCIAL: 'Devolución Parcial',
        DEVOLUCION_TOTAL: 'Devolución Total',
        ANULACION: 'Anulación',
        DESCUENTO_COMERCIAL: 'Descuento Comercial',
        DESCUENTO_CONDICIONAL: 'Descuento Condicional',
        OTRO: 'Otro'
    };

    const statusLabels: Record<CreditNoteStatus, string> = {
        DRAFT: 'Borrador',
        ISSUED: 'Emitida',
        APPLIED: 'Aplicada',
        REJECTED: 'Rechazada',
        CANCELLED: 'Cancelada'
    };

    const statusColors: Record<CreditNoteStatus, string> = {
        DRAFT: 'bg-gray-100 text-gray-700',
        ISSUED: 'bg-blue-100 text-blue-700',
        APPLIED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-200 text-red-800',
        CANCELLED: 'bg-red-100 text-red-700'
    };

    const typeColors: Record<CreditNoteType, string> = {
        RETURN: 'bg-blue-100 text-blue-700',
        DISCOUNT: 'bg-purple-100 text-purple-700',
        PRICE_ADJUSTMENT: 'bg-orange-100 text-orange-700'
    };

    return (
        <div className="min-h-fit animate-in fade-in duration-300">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <RotateCcw className="w-5 h-5 rotate-180" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold">
                                Nota de Crédito {creditNote.prefix || 'NC'}-{creditNote.number}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Fecha: {new Date(creditNote.date).toLocaleDateString('es-CO')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[creditNote.status]}`}>
                            {statusLabels[creditNote.status]}
                        </span>
                        {creditNote.status === CreditNoteStatus.DRAFT && (
                            <button
                                onClick={() => onCancel(creditNote)}
                                disabled={isCancelling}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isCancelling ? 'Cancelando...' : 'Cancelar'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                        <div className="flex items-center gap-2">
                            {creditNote.type === CreditNoteType.RETURN ? (
                                <RotateCcw className="w-4 h-4 text-blue-600" />
                            ) : creditNote.type === CreditNoteType.DISCOUNT ? (
                                <Percent className="w-4 h-4 text-purple-600" />
                            ) : (
                                <DollarSign className="w-4 h-4 text-orange-600" />
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[creditNote.type]}`}>
                                {typeLabels[creditNote.type]}
                            </span>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground mb-1">Motivo</p>
                        <p className="font-medium">{reasonLabels[creditNote.reason]}</p>
                    </div>
                    <div className="bg-card rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground mb-1">Factura Afectada</p>
                        <p className="font-medium">
                            #{creditNote.bill?.prefix || ''}{creditNote.bill?.number || creditNote.billId?.substring(0, 8)}
                        </p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Items de la Nota de Crédito</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Producto</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Cantidad</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Descuento</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Impuesto</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(creditNote.items || []).map((item: any, index: number) => (
                                    <tr key={item.id || index} className="border-b last:border-0">
                                        <td className="py-3 px-4">
                                            <p className="font-medium">{item.productName || 'Producto'}</p>
                                            {item.productCode && <p className="text-xs text-muted-foreground">{item.productCode}</p>}
                                        </td>
                                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                                        <td className="py-3 px-4 text-right">${Number(item.price || 0).toLocaleString('es-CO')}</td>
                                        <td className="py-3 px-4 text-right">${Number(item.discount || 0).toLocaleString('es-CO')}</td>
                                        <td className="py-3 px-4 text-right">{item.taxRate || 0}%</td>
                                        <td className="py-3 px-4 text-right font-medium">
                                            ${Number(item.total || 0).toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="bg-slate-50 rounded-xl border p-6 w-full md:w-80">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${Number(creditNote.subtotal || 0).toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Descuento</span>
                                <span>-${Number(creditNote.discountTotal || 0).toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Impuesto</span>
                                <span>${Number(creditNote.taxTotal || 0).toLocaleString('es-CO')}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span className="text-red-600">-${Number(creditNote.total || 0).toLocaleString('es-CO')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {creditNote.notes && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                        <p className="text-sm font-medium mb-1">Observaciones</p>
                        <p className="text-sm text-muted-foreground">{creditNote.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CreateCreditNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    bills: any[];
    isLoadingBills: boolean;
}

function CreateCreditNoteModal({ isOpen, onClose, onSubmit, isSubmitting, bills, isLoadingBills }: CreateCreditNoteModalProps) {
    const [step, setStep] = useState(1);
    const [selectedBillId, setSelectedBillId] = useState('');
    const [selectedType, setSelectedType] = useState<CreditNoteType>(CreditNoteType.DISCOUNT);
    const [selectedReason, setSelectedReason] = useState<CreditNoteReason>(CreditNoteReason.DESCUENTO_COMERCIAL);
    const [notes, setNotes] = useState('');
    const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: number; maxQuantity: number }>>({});

    const selectedBill = bills.find(b => b.id === selectedBillId);

    const handleItemToggle = (itemId: string, maxQuantity: number) => {
        setSelectedItems(prev => {
            if (prev[itemId]) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: { quantity: 1, maxQuantity } };
        });
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], quantity: Math.min(quantity, prev[itemId].maxQuantity) }
        }));
    };

    const calculateTotal = () => {
        if (!selectedBill) return 0;
        return Object.entries(selectedItems).reduce((sum, [itemId, { quantity }]) => {
            const item = selectedBill.items?.find((i: any) => i.id === itemId);
            return sum + (item ? Number(item.total || 0) * quantity / (item.quantity || 1) : 0);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!selectedBill) return;

        const items = Object.entries(selectedItems).map(([billItemId, { quantity }]) => {
            const item = selectedBill.items.find((i: any) => i.id === billItemId);
            return {
                billItemId,
                quantity,
                price: item?.price || '0',
                subtotal: item?.subtotal || '0',
                taxRate: item?.taxRate || '0',
                taxAmount: item?.taxAmount || '0',
                discount: item?.discount || '0',
                total: String(Number(item?.total || 0) * quantity / (item?.quantity || 1)),
                productName: item?.productName,
                productCode: item?.productCode
            };
        });

        await onSubmit({
            billId: selectedBillId,
            type: selectedType,
            reason: selectedReason,
            notes,
            items
        });

        // Reset form
        setStep(1);
        setSelectedBillId('');
        setSelectedType(CreditNoteType.DISCOUNT);
        setSelectedReason(CreditNoteReason.DESCUENTO_COMERCIAL);
        setNotes('');
        setSelectedItems({});
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Nueva Nota de Crédito</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                                    ${step >= s ? 'bg-[#6C47FF] text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {s}
                                </div>
                                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#6C47FF]' : 'bg-slate-200'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-medium">Seleccionar Factura</h3>
                            {isLoadingBills ? (
                                <p className="text-muted-foreground">Cargando facturas...</p>
                            ) : (
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {(bills || []).filter((b: any) => b.status !== 'CANCELLED').map((bill: any) => (
                                        <button
                                            key={bill.id}
                                            onClick={() => setSelectedBillId(bill.id)}
                                            className={`w-full p-4 rounded-lg border text-left transition-all
                                                ${selectedBillId === bill.id 
                                                    ? 'border-[#6C47FF] bg-purple-50' 
                                                    : 'hover:border-slate-300 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">#{bill.prefix || ''}{bill.number}</p>
                                                    <p className="text-sm text-muted-foreground">{bill.clientName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${Number(bill.total || 0).toLocaleString('es-CO')}</p>
                                                    <p className="text-xs text-muted-foreground">Saldo: ${Number(bill.balance || 0).toLocaleString('es-CO')}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && selectedBill && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipo</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: CreditNoteType.RETURN, label: 'Devolución', icon: RotateCcw, color: 'blue' },
                                            { value: CreditNoteType.DISCOUNT, label: 'Descuento', icon: Percent, color: 'purple' },
                                            { value: CreditNoteType.PRICE_ADJUSTMENT, label: 'Ajuste', icon: DollarSign, color: 'orange' }
                                        ].map(t => (
                                            <button
                                                key={t.value}
                                                onClick={() => setSelectedType(t.value)}
                                                className={`p-3 rounded-lg border text-center transition-all
                                                    ${selectedType === t.value 
                                                        ? `border-${t.color}-500 bg-${t.color}-50` 
                                                        : 'hover:bg-slate-50'}`}
                                            >
                                                <t.icon className={`w-5 h-5 mx-auto mb-1 text-${t.color}-600`} />
                                                <span className="text-xs">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Motivo</label>
                                    <select
                                        value={selectedReason}
                                        onChange={e => setSelectedReason(e.target.value as CreditNoteReason)}
                                        className="w-full p-2 rounded-lg border"
                                    >
                                        <option value={CreditNoteReason.DEVOLUCION_PARCIAL}>Devolución Parcial</option>
                                        <option value={CreditNoteReason.DEVOLUCION_TOTAL}>Devolución Total</option>
                                        <option value={CreditNoteReason.ANULACION}>Anulación</option>
                                        <option value={CreditNoteReason.DESCUENTO_COMERCIAL}>Descuento Comercial</option>
                                        <option value={CreditNoteReason.DESCUENTO_CONDICIONAL}>Descuento Condicional</option>
                                        <option value={CreditNoteReason.OTRO}>Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Seleccionar Items</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {(selectedBill.items || []).map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selectedItems[item.id]}
                                                    onChange={() => handleItemToggle(item.id, item.quantity)}
                                                    className="w-4 h-4 rounded border-gray-300"
                                                />
                                                <div>
                                                    <p className="font-medium">{item.productName || 'Producto'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Disp: {item.quantity} | ${Number(item.total || 0).toLocaleString('es-CO')}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedItems[item.id] && (
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={item.quantity}
                                                    value={selectedItems[item.id].quantity}
                                                    onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                    className="w-20 p-2 border rounded-lg text-center"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Notas/Observaciones</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Observaciones adicionales..."
                                    className="w-full p-3 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && selectedBill && (
                        <div className="space-y-4">
                            <h3 className="font-medium">Confirmar Nota de Crédito</h3>
                            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Factura:</span>
                                    <span>#{selectedBill.prefix || ''}{selectedBill.number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tipo:</span>
                                    <span>{selectedType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Motivo:</span>
                                    <span>{selectedReason}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Items:</span>
                                    <span>{Object.keys(selectedItems).length}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span className="text-red-600">${calculateTotal().toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t flex justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                        className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                    >
                        {step > 1 ? 'Atrás' : 'Cancelar'}
                    </button>
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={(step === 1 && !selectedBillId) || (step === 2 && Object.keys(selectedItems).length === 0)}
                            className="px-4 py-2 bg-[#6C47FF] text-white rounded-lg hover:bg-[#5a3ae0] disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#6C47FF] text-white rounded-lg hover:bg-[#5a3ae0] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Nota de Crédito'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CreditNotesPage() {
    const { creditNotes, isLoading, error, createCreditNote, cancelCreditNote, refetch, getCreditNote } = useCreditNote();
    const { bills, isLoading: isLoadingBills } = useBill();
    
    const [showDetail, setShowDetail] = useState(false);
    const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNoteWithRelations | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    
    const columns: TableColumn<any>[] = useMemo(() => [
        { 
            key: 'number', 
            header: 'Número', 
            cell: (item) => (
                <span className="font-medium">
                    {item.prefix || 'NC'}-{item.number}
                </span>
            ) 
        },
        { 
            key: 'bill', 
            header: 'Factura', 
            cell: (item) => (
                <span className="text-muted-foreground">
                    #{item.bill?.number || item.billId?.substring(0, 8)}
                </span>
            ) 
        },
        { 
            key: 'client', 
            header: 'Cliente', 
            cell: (item) => <span>{item.bill?.clientName || '-'}</span> 
        },
        { 
            key: 'type', 
            header: 'Tipo', 
            cell: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${item.type === 'RETURN' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'DISCOUNT' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'}`}>
                    {item.type === 'RETURN' ? 'Devolución' :
                        item.type === 'DISCOUNT' ? 'Descuento' :
                            'Ajuste'}
                </span>
            ) 
        },
        { 
            key: 'date', 
            header: 'Fecha', 
            cell: (item) => (
                <span className="text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('es-CO')}
                </span>
            ) 
        },
        { 
            key: 'total', 
            header: 'Total', 
            cell: (item) => (
                <span className="font-medium text-red-600">
                    -${Number(item.total).toLocaleString('es-CO')}
                </span>
            ) 
        },
        { 
            key: 'status', 
            header: 'Estado', 
            cell: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${item.status === 'APPLIED' ? 'bg-green-100 text-green-700' :
                        item.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                            item.status === 'ISSUED' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                    item.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                                        'bg-slate-100 text-slate-700'}`}>
                    {item.status === 'APPLIED' ? 'Aplicada' :
                        item.status === 'DRAFT' ? 'Borrador' :
                            item.status === 'ISSUED' ? 'Emitida' :
                                item.status === 'CANCELLED' ? 'Cancelada' :
                                    item.status === 'REJECTED' ? 'Rechazada' :
                                        item.status}
                </span>
            ) 
        },
    ], []);

    const handleView = useCallback(async (creditNote: any) => {
        const detail = await getCreditNote(creditNote.id);
        setSelectedCreditNote(detail);
        setShowDetail(true);
    }, [getCreditNote]);

    const handleCloseDetail = () => {
        setShowDetail(false);
        setSelectedCreditNote(null);
    };

    const handleCancel = async (creditNote: any) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta nota de crédito?')) {
            return;
        }
        
        setIsCancelling(true);
        try {
            const loadingToast = toast.loading('Cancelando nota de crédito...');
            await cancelCreditNote(creditNote.id);
            toast.update(loadingToast, { 
                render: 'Nota de crédito cancelada correctamente', 
                type: 'success', 
                isLoading: false, 
                autoClose: 3000 
            });
            if (showDetail) {
                handleCloseDetail();
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al cancelar la nota de crédito');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleCreate = async (data: any) => {
        setIsSubmitting(true);
        try {
            const loadingToast = toast.loading('Creando nota de crédito...');
            await createCreditNote(data);
            toast.update(loadingToast, { 
                render: 'Nota de crédito creada correctamente', 
                type: 'success', 
                isLoading: false, 
                autoClose: 3000 
            });
            setIsCreateModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Error al crear la nota de crédito');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const isInitialLoading = isLoading.fetch && creditNotes.length === 0;

    if (error) {
        console.error('CreditNotes error:', error);
        return (
            <div className="max-w-6xl mx-auto px-2 py-8 text-center animate-in fade-in duration-500">
                <div className="text-red-500 mb-4">
                    Hubo un error al cargar las notas de crédito.
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                    {error}
                </p>
                <button 
                    onClick={() => refetch()} 
                    className="px-4 py-2 bg-[#6C47FF] text-white rounded-lg hover:bg-[#5a3ae0]"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (showDetail && selectedCreditNote) {
        return (
            <CreditNoteDetail 
                creditNote={selectedCreditNote} 
                onClose={handleCloseDetail}
                onCancel={handleCancel}
                isCancelling={isCancelling}
            />
        );
    }

    return (
        <div className="min-h-fit animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto px-2 py-8">
                {isInitialLoading ? (
                    <div className="animate-in fade-in duration-200">
                        <ModernTableSkeleton rowCount={8} columnCount={7} />
                    </div>
                ) : (
                    <ModernTable
                        data={creditNotes}
                        columns={columns}
                        title="Notas de Crédito"
                        description="Gestiona las notas de crédito de tus facturas."
                        addActionLabel="Nueva nota de crédito"
                        onAdd={() => setIsCreateModalOpen(true)}
                        emptyIcon={Receipt}
                        emptyTitle="No hay notas de crédito"
                        emptyDescription="Crea notas de crédito para devoluciones, descuentos o ajustes."
                        searchable={true}
                        pagination={true}
                        onView={handleView}
                        isLoading={{
                            fetch: isLoading.fetch,
                            create: isLoading.create,
                            update: false,
                            deleteId: null,
                            deleteMany: false,
                            export: false,
                            view: false,
                            rowId: null,
                        }}
                    />
                )}
            </div>

            <CreateCreditNoteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                isSubmitting={isSubmitting}
                bills={bills || []}
                isLoadingBills={isLoadingBills.fetch}
            />
        </div>
    );
}

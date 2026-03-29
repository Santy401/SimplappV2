"use client";

import { useState, useMemo, useCallback } from 'react';
import { Receipt, FileText, Plus, CreditCard, RotateCcw, Percent, DollarSign, ArrowLeft, Printer, Download, Share2, Hash, User, Calendar, Ban, CheckCircle2, AlertCircle, X } from 'lucide-react';
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

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right">{value}</span>
    </div>
  );
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

    const statusConfig: Record<CreditNoteStatus, { label: string; badge: string; ribbon: string; icon: React.ElementType }> = {
        DRAFT:     { label: "Borrador",  badge: "bg-slate-100 text-slate-600", ribbon: "bg-slate-400",  icon: FileText },
        ISSUED:    { label: "Emitida",   badge: "bg-blue-50 text-blue-600",    ribbon: "bg-blue-500",   icon: FileText },
        APPLIED:   { label: "Aplicada",  badge: "bg-green-50 text-green-600", ribbon: "bg-emerald-500", icon: CheckCircle2 },
        REJECTED:  { label: "Rechazada", badge: "bg-red-50 text-red-600",     ribbon: "bg-red-500",    icon: AlertCircle },
        CANCELLED: { label: "Cancelada", badge: "bg-red-50 text-red-600",     ribbon: "bg-red-500",    icon: Ban }
    };

    const statusObj = statusConfig[creditNote.status];
    const StatusIcon = statusObj.icon;

    const fmt = (n: number | string) => Number(n).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white animate-in fade-in duration-300">
            {/* ── Sticky navbar ── */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Volver</span>
                        </button>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#6C47FF]" />
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Nota de Crédito {creditNote.prefix || 'NC'}-{creditNote.number}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusObj.badge}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusObj.label}
                            </span>
                        </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Imprimir
                        </button>
                        <button className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            PDF
                        </button>
                        {(creditNote.status === CreditNoteStatus.DRAFT || creditNote.status === CreditNoteStatus.APPLIED) && (
                            <button
                                onClick={() => onCancel(creditNote)}
                                disabled={isCancelling}
                                className="h-8 px-4 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Ban className="w-3.5 h-3.5" />
                                {isCancelling ? 'Cancelando...' : 'Cancelar NC'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Print Container - Only this section prints */}
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-5 print:p-0 print:space-y-0 print-invoice-container">
                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
                    <SectionCard className="px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-red-500">$ {fmt(creditNote.total)}</p>
                    </SectionCard>
                    <SectionCard className="px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">$ {fmt(creditNote.subtotal)}</p>
                    </SectionCard>
                    <SectionCard className="px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Impuestos</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">$ {fmt(creditNote.taxTotal)}</p>
                    </SectionCard>
                    <SectionCard className="px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Tipo</p>
                        <p className="text-xl font-bold text-blue-600 flex items-center gap-2 mt-1">
                            {creditNote.type === CreditNoteType.RETURN ? <RotateCcw className="w-5 h-5" /> : 
                             creditNote.type === CreditNoteType.DISCOUNT ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                            {typeLabels[creditNote.type]}
                        </p>
                    </SectionCard>
                </div>

                {/* Document Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none print-break-avoid">
                    {/* Status ribbon (print only) */}
                    <div className="no-print">
                        <div className={`${statusObj.ribbon} text-white text-xs font-bold tracking-widest py-1 text-center`}>
                            {statusObj.label.toUpperCase()}
                        </div>
                    </div>

                    {/* Document header */}
                    <div className="px-8 py-6 border-b-2 border-slate-200 dark:border-slate-700 flex items-start justify-between gap-6 relative invoice-header">
                        {/* Status ribbon diagonal (screen only) */}
                        <div className={`absolute top-6 -left-12 transform -rotate-45 ${statusObj.ribbon} text-white py-1 px-16 text-xs font-bold tracking-widest shadow-md no-print`}>
                            {statusObj.label.toUpperCase()}
                        </div>

                        <div className="w-36 h-20 shrink-0 flex items-center justify-start invoice-logo">
                            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-3xl tracking-tighter">Simplapp</span>
                            </div>
                        </div>

                        {/* Center */}
                        <div className="flex-1 text-center">
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Simplapp S.A.S</p>
                            <p className="text-xs text-slate-400 mt-1">NIT: 900.000.000-1</p>
                            <p className="text-xs font-medium uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-1 px-3 rounded-full inline-block mt-3">
                                Nota de Crédito
                            </p>
                        </div>

                        {/* Number */}
                        <div className="text-right shrink-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Comprobante No.</p>
                            <div className="inline-flex items-center gap-1.5 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-3 py-1.5">
                                <Hash className="w-3.5 h-3.5 text-[#6C47FF]" />
                                <span className="text-lg font-bold text-[#6C47FF]">{creditNote.prefix || 'NC'}-{creditNote.number}</span>
                            </div>
                        </div>
                    </div>

                    {/* Client + dates info */}
                    <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 dark:border-slate-800">
                        {/* Client */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-[#6C47FF]" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cliente</span>
                            </div>
                            <InfoRow label="Nombre" value={<span className="font-semibold">{creditNote.bill?.clientName || "Consumidor Final"}</span>} />
                            <InfoRow label="Identificación" value={creditNote.bill?.clientIdentification || "-"} />
                        </div>

                        {/* Dates */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-[#6C47FF]" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Referencias</span>
                            </div>
                            <InfoRow label="Fecha Generación" value={new Date(creditNote.date).toLocaleDateString("es-CO")} />
                            <InfoRow label="Motivo de Nota" value={<span className="font-semibold text-slate-600">{reasonLabels[creditNote.reason]}</span>} />
                            <InfoRow label="Factura Afectada" value={
                                <span className="text-[#6C47FF] font-medium">#{creditNote.bill?.prefix || ''}{creditNote.bill?.number || creditNote.billId?.substring(0, 8)}</span>
                            } />
                        </div>
                    </div>

                    {/* Items table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                                    {["Descripción", "Cant.", "V. Unit", "Desc %", "Valor Total"].map((h, i) => (
                                        <th key={i} className={`px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 ${i === 0 ? "text-left" : "text-right"}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {(creditNote.items || []).map((item: any, i: number) => (
                                    <tr key={item.id || i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.productName || 'Producto'}</p>
                                            {item.productCode && <p className="text-xs text-slate-400 mt-0.5">{item.productCode}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-400">$ {fmt(item.price)}</td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-400">{item.discount || 0}%</td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-800 dark:text-slate-200">$ {fmt(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-end print-break-avoid">
                        <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden invoice-total-section">
                            <div className="px-5 py-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="text-base font-semibold text-slate-700 dark:text-slate-300">$ {fmt(creditNote.subtotal)}</span>
                                </div>
                                {Number(creditNote.discountTotal || 0) > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Descuentos</span>
                                        <span className="text-base font-semibold text-red-600">− $ {fmt(creditNote.discountTotal)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Impuestos</span>
                                    <span className="text-base font-semibold text-slate-700 dark:text-slate-300">$ {fmt(creditNote.taxTotal)}</span>
                                </div>
                            </div>
                            <div className="px-5 py-4 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20 flex items-center justify-between">
                                <span className="text-sm font-semibold text-red-700 dark:text-red-400">Total a Reintegrar</span>
                                <span className="text-2xl font-black text-red-600 invoice-grand-total">$ {fmt(creditNote.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes & Terms */}
                    <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Observaciones</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                {creditNote.notes || "Sin observaciones."}
                            </p>
                        </div>
                    </div>
                </div>
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

    const getAvailableReturnQty = (billItemId: string): number => {
        if (!selectedBill) return 0;
        const originalItem = selectedBill.items?.find((i: any) => i.id === billItemId);
        if (!originalItem) return 0;
        const returnedQty = (selectedBill.creditNotes || [])
            .filter((cn: any) => cn.type === 'RETURN' && cn.status !== 'CANCELLED')
            .flatMap((cn: any) => cn.items || [])
            .filter((ci: any) => ci.billItemId === billItemId)
            .reduce((sum: number, ci: any) => sum + ci.quantity, 0);
        return Math.max(0, originalItem.quantity - returnedQty);
    };

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Nueva Nota de Crédito</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <X className="w-5 h-5" />
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
                                            className={`w-full p-4 rounded-lg border border-slate-300 text-left transition-all
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
                                                className={`p-3 rounded-lg border border-slate-300 text-center transition-all
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
                                        className="w-full p-2 rounded-lg border border-slate-300"
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
                                    {(selectedBill.items || []).map((item: any) => {
                                        const isReturn = selectedType === CreditNoteType.RETURN;
                                        const availableQty = isReturn ? getAvailableReturnQty(item.id) : item.quantity;
                                        return (
                                            <div key={item.id} className={`flex items-center justify-between p-3 border border-slate-300 rounded-lg ${isReturn && availableQty <= 0 ? 'opacity-40' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedItems[item.id]}
                                                        onChange={() => handleItemToggle(item.id, availableQty)}
                                                        disabled={isReturn && availableQty <= 0}
                                                        className="w-4 h-4 rounded border-gray-300"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.productName || 'Producto'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {isReturn ? `Disp. devolución: ${availableQty}` : `Cant: ${item.quantity}`} | ${Number(item.total || 0).toLocaleString('es-CO')}
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedItems[item.id] && (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={availableQty}
                                                        value={selectedItems[item.id].quantity}
                                                        onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                        className="w-20 p-2 border border-slate-300 rounded-lg text-center"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Notas/Observaciones</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Observaciones adicionales..."
                                    className="w-full p-3 border border-slate-300 rounded-lg"
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

                <div className="p-6 border-t border-slate-200 flex justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
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
    const { bills, isLoading: isLoadingBills, refetch: refetchBills } = useBill();
    
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
                    ${Number(item.total).toLocaleString('es-CO')}
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
            refetchBills();
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
            refetchBills();
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

"use client";

import React, { useState } from 'react';
import { FormBillItem } from "../FormBill/FormBill";
import type { BillStatus, PaymentMethod, DianStatus } from '@domain/entities/Bill.entity';
import { XCircle, Terminal, Info, Printer, Download, Share2, Edit2, Plus, ChevronDown } from 'lucide-react';

export interface PaymentPreview {
    id: string;
    date: string | Date;
    receiptNumber?: string | null;
    method: string;
    account?: { name: string } | null;
    amount: number | string;
}

export interface BillPreviewProps {
    formData: {
        number?: number;
        date: string;
        dueDate: string;
        clientName: string;
        clientId: string; // identification
        email: string;
        paymentMethod: PaymentMethod;
        status: BillStatus | string;
        notes?: string;
        terms?: string;
        footerNote?: string;
        logo?: string;
        dianStatus?: DianStatus;
        rejectedReason?: string;
        dianResponse?: string;
    };
    items: FormBillItem[];
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    total: number;
    payments?: PaymentPreview[];
    onClose: () => void;
}

export function BillPreview({
    formData,
    items,
    subtotal,
    discountTotal,
    taxTotal,
    total,
    payments,
    onClose,
}: BillPreviewProps) {
    const [showDianModal, setShowDianModal] = useState(false);

    // Determines ribbon color and text
    const getStatusRibbon = () => {
        switch (formData.status) {
            case 'PAID':
                return { text: 'PAGADA', bg: 'bg-emerald-500' };
            case 'TO_PAY':
                return { text: 'POR COBRAR', bg: 'bg-orange-500' };
            case 'DRAFT':
                return { text: 'BORRADOR', bg: 'bg-gray-400' };
            case 'CANCELLED':
                return { text: 'CANCELADA', bg: 'bg-red-500' };
            case 'PARTIALLY_PAID':
                return { text: 'PAGO PARCIAL', bg: 'bg-blue-500' };
            default:
                return { text: formData.status || 'EMITIDA', bg: 'bg-zinc-600' };
        }
    };

    const ribbon = getStatusRibbon();

    return (
        <div className="w-full flex items-start justify-center print:p-0 print:bg-white print:block">
            <div className="w-full max-w-5xl py-8 px-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-300 print:py-0 print:px-0">

                {/* Header Toolbar */}
                <div className="w-full max-w-4xl flex justify-between items-center mb-6 print:hidden">
                    <h1 className="text-2xl font-bold text-slate-800">Factura de venta {formData.number ? formData.number : ''}</h1>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 font-medium bg-slate-200/50 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
                        Volver
                    </button>
                </div>

                {/* Actions Toolbar */}
                <div className="w-full max-w-4xl flex flex-wrap gap-3 mb-6 print:hidden">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                        <Edit2 className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                        <Printer className="w-4 h-4" /> Imprimir
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                        <Download className="w-4 h-4" /> Descargar PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                        <Share2 className="w-4 h-4" /> Compartir
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                        <Plus className="w-4 h-4" /> Agregar pago
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors ml-auto md:ml-0">
                        Más acciones <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-wrap justify-between items-center mb-8 print:hidden">
                    <div className="flex-1 min-w-[150px] mb-4 md:mb-0 border-r border-slate-100 pr-4">
                        <p className="text-slate-500 text-sm mb-1">Valor total</p>
                        <p className="text-2xl font-bold text-slate-800">${total.toLocaleString("es-CO")}</p>
                    </div>
                    <div className="flex-1 min-w-[150px] mb-4 md:mb-0 border-r border-slate-100 px-4">
                        <p className="text-slate-500 text-sm mb-1">Retenido</p>
                        <p className="text-2xl font-semibold text-orange-500">$ 0</p>
                    </div>
                    <div className="flex-1 min-w-[150px] mb-4 md:mb-0 border-r border-slate-100 px-4">
                        <p className="text-slate-500 text-sm mb-1">Cobrado</p>
                        <p className="text-2xl font-semibold text-emerald-500">$ {ribbon.text === 'PAGADA' ? total.toLocaleString("es-CO") : '0'}</p>
                    </div>
                    <div className="flex-1 min-w-[150px] pl-4">
                        <p className="text-slate-500 text-sm mb-1">Por cobrar</p>
                        <p className="text-2xl font-semibold text-orange-500">$ {ribbon.text !== 'PAGADA' ? total.toLocaleString("es-CO") : '0'}</p>
                    </div>
                </div>

                {/* Final Invoice Paper Document */}
                <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm p-12 relative overflow-hidden print:shadow-none print:p-0">

                    {/* Status Ribbon */}
                    <div className={`absolute top-8 -left-14 transform -rotate-45 ${ribbon.bg} text-white py-1.5 px-16 font-bold text-xs tracking-[0.2em] shadow-md z-10`}>
                        {ribbon.text}
                    </div>

                    {/* DIAN Error Message if applicable */}
                    {formData.dianStatus === 'REJECTED' && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4 print:hidden">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-red-900 font-bold text-lg flex items-center gap-2">
                                    Factura Rechazada por DIAN
                                </h3>
                                <p className="text-red-700 mt-1 leading-relaxed">
                                    <span className="font-semibold text-red-800">Motivo:</span> {formData.rejectedReason || 'No se proporcionó un motivo específico.'}
                                </p>
                                {formData.dianResponse && (
                                    <button
                                        onClick={() => setShowDianModal(true)}
                                        className="mt-4 flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900 transition-colors group"
                                    >
                                        <Terminal className="w-4 h-4" />
                                        <span className="border-b border-red-300 group-hover:border-red-900">Ver respuesta técnica completa</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Document Header */}
                    <div className="flex justify-between items-start mb-16 relative z-0">
                        {/* Logo Space - Replicating the 'N. Logo' visual */}
                        <div className={`w-64 h-24 flex items-center justify-start ${!formData.logo ? 'bg-zinc-900 rounded-sm' : ''}`}>
                            {formData.logo ? (
                                <img src={formData.logo} alt="Company Logo" className="w-auto h-full object-contain" />
                            ) : (
                                <div className="text-white font-serif font-bold text-6xl tracking-tighter pl-4">N.</div>
                            )}
                        </div>

                        {/* Company Details */}
                        <div className="text-center absolute left-1/2 transform -translate-x-1/2">
                            <h2 className="text-xl font-bold text-slate-800">Simplapp S.A.S</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Identificación: 900.000.000-1</p>
                        </div>

                        {/* Invoice Number */}
                        <div className="text-right flex items-baseline gap-2">
                            <span className="text-teal-600 font-bold text-xl">No.</span>
                            <span className="text-slate-600 text-xl">{formData.number || 'Auto'}</span>
                        </div>
                    </div>

                    {/* Client & Dates Info Grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                        {/* Client details */}
                        <div className="space-y-4">
                            <div className="flex border-b border-slate-100 pb-2">
                                <span className="w-32 text-slate-500 text-sm">Cliente</span>
                                <span className="font-semibold text-teal-800 text-sm uppercase">{formData.clientName || 'Consumidor Final'}</span>
                            </div>
                            <div className="flex border-b border-slate-100 pb-2">
                                <span className="w-32 text-slate-500 text-sm">Identificación</span>
                                <span className="text-slate-700 text-sm font-medium">{formData.clientId}</span>
                            </div>
                            <div className="flex border-b border-slate-100 pb-2">
                                <span className="w-32 text-slate-500 text-sm">Teléfono / Correo</span>
                                <span className="text-slate-700 text-sm">{formData.email}</span>
                            </div>
                        </div>

                        {/* Dates details */}
                        <div className="space-y-4">
                            <div className="flex border-b border-slate-100 pb-2">
                                <span className="w-32 text-slate-500 text-sm">Creación</span>
                                <span className="text-slate-700 text-sm font-medium">{new Date(formData.date).toLocaleDateString('es-CO')}</span>
                            </div>
                            <div className="flex border-b border-slate-100 pb-2">
                                <span className="w-32 text-slate-500 text-sm">Vencimiento</span>
                                <span className="text-slate-700 text-sm font-medium">{new Date(formData.dueDate).toLocaleDateString('es-CO')}</span>
                            </div>
                            <div className="flex border-b border-slate-100 pb-2">
                                <span className="w-32 text-slate-500 text-sm">Plazo de pago</span>
                                <span className="text-slate-700 text-sm font-bold uppercase">{formData.paymentMethod === 'CASH' ? 'De Contado' : 'Crédito'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12 rounded-lg overflow-hidden border border-slate-100">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Item / Referencia</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide text-right">Cant</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide text-right">Precio</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide text-right">Desc%</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide text-right">Impto%</th>
                                    <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-slate-800 text-sm">{item.productName}</p>
                                            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                        </td>
                                        <td className="py-4 px-4 text-right text-slate-700 font-medium text-sm">{item.quantity}</td>
                                        <td className="py-4 px-4 text-right text-slate-700 text-sm">${item.price.toLocaleString("es-CO")}</td>
                                        <td className="py-4 px-4 text-right text-slate-700 text-sm">{item.discount}%</td>
                                        <td className="py-4 px-4 text-right text-slate-700 text-sm">{item.taxRate}%</td>
                                        <td className="py-4 px-4 text-right font-bold text-slate-800 text-sm">${item.total.toLocaleString("es-CO")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mb-16">
                        <div className="w-80 space-y-3">
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Subtotal</span>
                                <span className="font-medium">${subtotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Descuentos</span>
                                <span className="font-medium text-orange-600">-${discountTotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Impuestos</span>
                                <span className="font-medium">${taxTotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-slate-800 border-t border-slate-200 mt-4 pt-4">
                                <span>Total General</span>
                                <span className="text-2xl">${total.toLocaleString("es-CO")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Notes & Terms */}
                    <div className="border-t border-slate-100 pt-8 mt-12 text-sm">
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <h4 className="font-bold text-slate-800 mb-3 text-sm tracking-wide uppercase">Notas Adicionales</h4>
                                <p className="text-slate-500 whitespace-pre-wrap leading-relaxed">{formData.notes || "Sin notas."}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-3 text-sm tracking-wide uppercase">Términos y Condiciones</h4>
                                <p className="text-slate-500 whitespace-pre-wrap leading-relaxed">{formData.terms || "Esta factura se rige bajo los términos convencionales de pago."}</p>
                            </div>
                        </div>
                        {formData.footerNote && (
                            <div className="mt-12 text-center text-xs text-slate-400 font-medium">
                                {formData.footerNote}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Pagos Recibidos Section */}
            {payments && payments.length > 0 && (
                <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm p-8 mt-8 border border-slate-100 print:hidden">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Historial de Pagos</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Recibo / Ref</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Método</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide">Cuenta / Caja</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wide text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.map((payment: PaymentPreview) => (
                                    <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 text-slate-700 text-sm">
                                            {new Date(payment.date).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="py-3 px-4 text-emerald-600 font-medium text-sm">
                                            {payment.receiptNumber || payment.id.substring(0, 8)}
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 text-sm">
                                            {payment.method === 'CASH' ? 'Efectivo' : payment.method === 'TRANSFER' ? 'Transferencia' : payment.method === 'CREDIT_CARD' ? 'Tarjeta' : payment.method}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 text-sm">
                                            {payment.account?.name || 'No asociada'}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-slate-800 text-sm">
                                            ${Number(payment.amount).toLocaleString("es-CO")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DIAN Modal */}
            {showDianModal && formData.dianResponse && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    {/* ...existing dian modal code... */}
                    <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 w-full max-w-2xl shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <Terminal className="w-5 h-5 text-zinc-400" />
                                </div>
                                <h3 className="font-semibold text-lg text-white">Respuesta Técnica DIAN</h3>
                            </div>
                            <button onClick={() => setShowDianModal(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="bg-black/50 rounded-xl p-4 border border-zinc-800 font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
                                <pre className="whitespace-pre-wrap break-all">
                                    {(() => {
                                        try { return JSON.stringify(JSON.parse(formData.dianResponse), null, 2); }
                                        catch { return formData.dianResponse; }
                                    })()}
                                </pre>
                            </div>
                            <div className="mt-6 flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                                <Info className="w-5 h-5 text-zinc-400 mt-0.5" />
                                <p className="text-xs text-zinc-400 leading-relaxed">Esta es la respuesta cruda enviada por los servidores de la DIAN.</p>
                            </div>
                        </div>
                        <div className="p-5 border-t border-zinc-800 flex justify-end">
                            <button onClick={() => setShowDianModal(false)} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-all">Entendido</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

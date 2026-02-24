
import React, { useState } from 'react';
import { FormBillItem } from "./FormBill";
import { BillStatus, PaymentMethod, DianStatus } from '@domain/entities/Bill.entity';
import { XCircle, Terminal, Info } from 'lucide-react';

export interface BillPreviewProps {
    formData: {
        date: string;
        dueDate: string;
        clientName: string;
        clientId: string; // identification
        email: string;
        paymentMethod: PaymentMethod;
        status: BillStatus; /* ... other fields ... */
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
    onClose: () => void;
}

export function BillPreview({
    formData,
    items,
    subtotal,
    discountTotal,
    taxTotal,
    total,
    onClose,
}: BillPreviewProps) {
    const [showDianModal, setShowDianModal] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 print:p-0">
            <div className="bg-card text-card-foreground border border-border w-full max-w-4xl min-h-[800px] shadow-2xl rounded-lg flex flex-col relative animate-in zoom-in-99 scale-69 duration-200">

                {/* Toolbar */}
                <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30 rounded-t-lg print:hidden">
                    <h2 className="font-semibold text-lg">Previsualización de Factura</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm font-medium transition-colors"
                        >
                            Imprimir / Descargar PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-background border border-border rounded hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="p-8 md:p-12 flex-1 bg-card overflow-y-auto" id="invoice-preview">

                    {/* DIAN Rejection Banner */}
                    {formData.dianStatus === DianStatus.REJECTED && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300 print:hidden">
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

                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            {/* Company Logo Placeholder */}
                            <div className={`w-32 h-32 flex items-center justify-center mb-4 ${!formData.logo ? 'bg-muted/20 border-2 border-dashed border-border rounded-lg text-muted-foreground' : ''}`}>
                                {formData.logo ? (
                                    <img src={formData.logo} alt="Company Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-sm">Logo</span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-foreground mb-2">FACTURA DE VENTA</h1>
                            <div className="text-muted-foreground">
                                {/* Aquí se puede agregar el estado que tiene la factura sea pagada o pendiente */}
                                <p className="font-semibold text-lg text-foreground">{formData.status}</p>
                                {/* Este apartado se rellenada dependiendo de los datos de la empresa logeada*/}
                                <p className="text-sm mt-2">Simplapp S.A.S</p>
                                <p className="text-sm">NIT: 900.000.000-1</p>
                            </div>
                        </div>
                    </div>

                    {/* Client & Dates */}
                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div>
                            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Facturar a</h3>
                            <div className="text-foreground">
                                <p className="font-bold text-lg">{formData.clientName || 'Unknow'}</p>
                                <p>{formData.clientId ? `CC: ${formData.clientId}` : ''}</p>
                                <p>{formData.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Fecha de Emisión</h3>
                                <p className="text-foreground font-medium">{formData.date}</p>
                            </div>
                            <div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Vencimiento</h3>
                                <p className="text-foreground font-medium">{formData.dueDate}</p>
                            </div>
                            <div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Método de Pago</h3>
                                {/* Map PaymentMethod enum to string if needed */}
                                <p className="text-foreground font-medium">{formData.paymentMethod}</p>
                            </div>
                            <div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Estado</h3>
                                <p className="text-foreground font-medium">{formData.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">Item</th>
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">Descripción</th>
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider text-right">Cant</th>
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider text-right">Precio</th>
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider text-right">Desc%</th>
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider text-right">Imp%</th>
                                    <th className="py-3 text-sm font-bold text-muted-foreground uppercase tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {items.map((item, index) => (
                                    <tr key={item.id} className="border-b border-border">
                                        <td className="py-4 font-medium text-foreground">{item.productName}</td>
                                        <td className="py-4 text-muted-foreground">{item.description}</td>
                                        <td className="py-4 text-right text-foreground">{item.quantity}</td>
                                        <td className="py-4 text-right text-foreground">${item.price.toLocaleString("es-CO")}</td>
                                        <td className="py-4 text-right text-foreground">{item.discount}%</td>
                                        <td className="py-4 text-right text-foreground">{item.taxRate}%</td>
                                        <td className="py-4 text-right font-bold text-foreground">${item.total.toLocaleString("es-CO")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-12">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between text-destructive">
                                <span>Descuento</span>
                                <span>-${discountTotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Impuestos</span>
                                <span>${taxTotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-foreground border-t border-border pt-3">
                                <span>Total</span>
                                <span>${total.toLocaleString("es-CO")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Notes */}
                    <div className="grid grid-cols-2 gap-8 text-sm text-foreground border-t border-border pt-8">
                        <div>
                            <h4 className="font-bold mb-2">Términos y Condiciones</h4>
                            <p className="whitespace-pre-wrap text-muted-foreground">{formData.terms || "Sin términos especificados."}</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">Notas</h4>
                            <p className="whitespace-pre-wrap text-muted-foreground">{formData.notes || "Sin notas adicionales."}</p>
                        </div>
                    </div>
                    {formData.footerNote && (
                        <div className="mt-8 text-center text-xs text-muted-foreground">
                            {formData.footerNote}
                        </div>
                    )}
                </div>
            </div>

            {/* DIAN Raw Response Modal */}
            {showDianModal && formData.dianResponse && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 w-full max-w-2xl shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <Terminal className="w-5 h-5 text-zinc-400" />
                                </div>
                                <h3 className="font-semibold text-lg text-white">Respuesta Técnica DIAN</h3>
                            </div>
                            <button
                                onClick={() => setShowDianModal(false)}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="bg-black/50 rounded-xl p-4 border border-zinc-800 font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
                                <pre className="whitespace-pre-wrap break-all">
                                    {(() => {
                                        try {
                                            return JSON.stringify(JSON.parse(formData.dianResponse), null, 2);
                                        } catch (e) {
                                            return formData.dianResponse;
                                        }
                                    })()}
                                </pre>
                            </div>
                            <div className="mt-6 flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                                <Info className="w-5 h-5 text-zinc-400 mt-0.5" />
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Esta es la respuesta cruda enviada por los servidores de la DIAN. Contiene detalles técnicos sobre el rechazo que pueden ser útiles para soporte técnico.
                                </p>
                            </div>
                        </div>
                        <div className="p-5 border-t border-zinc-800 flex justify-end">
                            <button
                                onClick={() => setShowDianModal(false)}
                                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

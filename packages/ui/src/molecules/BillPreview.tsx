
import React from 'react';
import { FormBillItem } from "./FormBill";
import { BillStatus, PaymentMethod } from '@domain/entities/Bill.entity';

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
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
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
                <div className="p-8 md:p-12 flex-1 bg-card" id="invoice-preview">

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
        </div>
    );
}

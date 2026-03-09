"use client";

import React, { useState } from "react";
import { X, Info, ExternalLink, Receipt, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { Label } from "../../atoms/Label/Label";
import { Textarea } from "../../atoms/Textarea/Textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../atoms/Select/Select";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PaymentIncomeType = "CLIENT_INVOICE" | "OTHER";

export interface BankAccount { id: string; name: string; }
export interface Client { id: string; name: string; }
export interface BillOption { id: string; number: string | number; balance: number; clientId: string; dueDate?: string; total?: number; }

export interface PaymentBillModalProps {
  receiptNumber?: number;
  companyName?: string;
  bankAccounts?: BankAccount[];
  clients?: Client[];
  bills?: BillOption[];
  onSubmit?: (data: PaymentBillFormData) => void;
  onClose?: () => void;
}

export interface PaymentBillFormData {
  clientId: string;
  bankAccountId: string;
  paymentDate: string;
  paymentMethod: string;
  costCenter: string;
  incomeType: PaymentIncomeType;
  invoicePayments: { billId: string; amount: number }[];
  notes: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PaymentBillModal({
  receiptNumber = 3,
  companyName = "Simplapp",
  bankAccounts = [],
  clients = [],
  bills = [],
  onSubmit,
  onClose,
}: PaymentBillModalProps) {
  const [clientId, setClientId] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [incomeType, setIncomeType] = useState<PaymentIncomeType>("CLIENT_INVOICE");
  const [notes, setNotes] = useState("");
  const [invoiceAmounts, setInvoiceAmounts] = useState<Record<string, number>>({});
  
  const filteredBills = React.useMemo(() => bills.filter(b => b.clientId === clientId), [bills, clientId]);
  
  React.useEffect(() => {
    const initialAmounts: Record<string, number> = {};
    filteredBills.forEach(b => {
      initialAmounts[b.id] = b.balance;
    });
    setInvoiceAmounts(initialAmounts);
  }, [filteredBills]);

  const total = Object.values(invoiceAmounts).reduce((acc, val) => acc + (Number(val) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoicePayments = filteredBills.map((b) => ({
      billId: b.id,
      amount: Number(invoiceAmounts[b.id]) || 0
    })).filter(p => p.amount > 0);

    onSubmit?.({ clientId, bankAccountId, paymentDate, paymentMethod, costCenter, incomeType, invoicePayments, notes });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      {/* Page title */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-subtle-bg shrink-0">
          <Receipt className="w-4 h-4 text-brand" />
        </div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Nuevo pago recibido</h1>
      </div>

      {/* Card principal */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">

        {/* Header del documento */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm leading-tight">{companyName}</span>
            <span className="text-xs text-muted-foreground mt-0.5">Recibo de caja en proceso</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-brand-light bg-brand-subtle-bg px-2.5 py-0.5 rounded-full">
              No. {receiptNumber}
            </span>
            <button type="button" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand dark:hover:text-brand-light transition-colors">
              Ver recibo <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {clients.length === 0 && <SelectItem value="__none__" disabled>Sin clientes</SelectItem>}
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                Cuenta bancaria <span className="text-brand font-bold leading-none">*</span>
                <Info className="w-3 h-3 text-muted-foreground/60" />
              </Label>
              <Select value={bankAccountId} onValueChange={setBankAccountId}>
                <SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {bankAccounts.length === 0 && <SelectItem value="__none__" disabled>Sin cuentas configuradas</SelectItem>}
                  {bankAccounts.map((acc) => <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                Fecha de pago <span className="text-brand font-bold leading-none">*</span>
              </Label>
              <div className="relative">
                <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full h-9 text-sm pr-8" />
                <button type="button" onClick={() => setPaymentDate("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                Forma de pago <span className="text-brand font-bold leading-none">*</span>
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                  <SelectItem value="TRANSFER">Transferencia bancaria</SelectItem>
                  <SelectItem value="CREDIT_CARD">Tarjeta de crédito</SelectItem>
                  <SelectItem value="DEBIT_CARD">Tarjeta de débito</SelectItem>
                  <SelectItem value="CHECK">Cheque</SelectItem>
                  <SelectItem value="DEPOSIT">Depósito bancario</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                Centro de costo <Info className="w-3 h-3 text-muted-foreground/60" />
              </Label>
              <Select value={costCenter} onValueChange={setCostCenter}>
                <SelectTrigger className="w-full h-9 text-sm"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
                  <SelectItem value="operaciones">Operaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divisor */}
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            <span className="mx-3 text-xs font-medium text-slate-500 uppercase tracking-widest">Tipo de ingreso</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Tab toggle */}
          <div className="flex gap-2 p-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => setIncomeType("CLIENT_INVOICE")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${incomeType === "CLIENT_INVOICE" ? "bg-white dark:bg-slate-800 text-brand shadow-sm border border-slate-200 dark:border-slate-700" : "text-muted-foreground hover:text-foreground"}`}>
              Pago a factura de cliente
            </button>
            <button type="button" onClick={() => setIncomeType("OTHER")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${incomeType === "OTHER" ? "bg-white dark:bg-slate-800 text-brand shadow-sm border border-slate-200 dark:border-slate-700" : "text-muted-foreground hover:text-foreground"}`}>
              Otros ingresos
            </button>
          </div>

          {/* Facturas / empty state */}
          {incomeType === "CLIENT_INVOICE" && (
            <>
              {clientId === "" ? (
                <div className="flex items-start gap-3 bg-brand-subtle-bg border border-brand-subtle-border rounded-lg px-4 py-3">
                  <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-sm text-brand dark:text-brand-light">Selecciona un cliente para traer sus facturas por cobrar.</p>
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="flex items-center gap-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-sm text-slate-500">
                  <Info className="w-4 h-4 shrink-0" /> Este cliente no tiene facturas pendientes de cobro.
                </div>
              ) : (
                <div className="mt-4">
                  <div className="flex flex-col mb-4">
                    <h3 className="text-base font-semibold text-foreground">Facturas por cobrar</h3>
                    <p className="text-sm text-muted-foreground">Agrega el monto recibido a las facturas relacionadas con este ingreso.</p>
                  </div>
                  
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-sm bg-white dark:bg-slate-900">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Número</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Vencimiento</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Total</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Retenciones</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Por cobrar</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Monto recibido</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredBills.map((bill) => {
                            const isOverdue = bill.dueDate ? new Date(bill.dueDate) < new Date() : false;
                            
                            // Formato manual simple dd/mm/yyyy
                            const formattedDate = bill.dueDate ? (() => {
                              const [y, m, d] = bill.dueDate.split("T")[0].split("-");
                              return `${d}/${m}/${y}`;
                            })() : '---';

                            return (
                              <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-4 py-3 text-foreground font-medium">{bill.number}</td>
                                <td className={`px-4 py-3 font-medium ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                                  {formattedDate}
                                </td>
                                <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap">
                                  $ {(bill.total || bill.balance).toLocaleString("es-CO")}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-center gap-2 text-slate-500 group">
                                    <span className="font-medium">$</span>
                                    <div className="relative">
                                      <Input type="number" defaultValue={0} className="w-[100px] h-9 text-left px-3 text-sm" />
                                      <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-white dark:bg-slate-800">
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap">
                                  $ {bill.balance.toLocaleString("es-CO")}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-2 text-slate-500">
                                    <span className="font-medium">$</span>
                                    <Input 
                                      type="number" 
                                      value={invoiceAmounts[bill.id] === undefined ? '' : invoiceAmounts[bill.id]} 
                                      onChange={(e) => setInvoiceAmounts(prev => ({ ...prev, [bill.id]: parseFloat(e.target.value) }))}
                                      className="w-[120px] h-9 text-left text-sm" 
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end text-sm text-slate-400">
                      <span>1-{filteredBills.length} de {filteredBills.length}</span>
                      <button type="button" className="ml-4 hover:text-slate-700 transition-colors disabled:opacity-50" disabled>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button type="button" className="ml-2 hover:text-slate-700 transition-colors disabled:opacity-50" disabled>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Total Amount below table */}
                  <div className="flex items-center justify-end py-6 mt-4 pr-4">
                    <div className="text-xl font-bold flex items-center justify-between w-64">
                      <span className="text-foreground -mr-4">Total</span>
                      <span className="text-foreground">$ {(clientId ? total : 0).toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Notas */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notas</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agrega detalles adicionales que serán visibles en la impresión." className="min-h-[88px] resize-none text-sm" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            {onClose && <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">Cancelar</Button>}
            <Button type="submit" variant="default" className="h-9 px-5 text-sm">Guardar recibo</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

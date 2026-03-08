"use client";

import React, { useState } from "react";
import { X, Info, ExternalLink, Receipt } from "lucide-react";
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
export interface BillOption { id: string; number: string | number; balance: number; }

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

  const total = bills.reduce((acc, b) => acc + b.balance, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ clientId, bankAccountId, paymentDate, paymentMethod, costCenter, incomeType, invoicePayments: bills.map((b) => ({ billId: b.id, amount: b.balance })), notes });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0C0C0C] px-4 py-8">
      {/* Page title */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-subtle-bg shrink-0">
          <Receipt className="w-4 h-4 text-brand" />
        </div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Nuevo pago recibido</h1>
      </div>

      {/* Card principal */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#141414] border border-[#ddd] dark:border-[#2d2d2d] rounded-xl shadow-sm">

        {/* Header del documento */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#ddd] dark:border-[#2d2d2d]">
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
            <div className="flex-1 border-t border-[#ddd] dark:border-[#2d2d2d]" />
            <span className="mx-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">Tipo de ingreso</span>
            <div className="flex-1 border-t border-[#ddd] dark:border-[#2d2d2d]" />
          </div>

          {/* Tab toggle */}
          <div className="flex gap-2 p-1 rounded-lg bg-[#F5F7FB] dark:bg-[#1a1a1a] border border-[#ddd] dark:border-[#2d2d2d]">
            <button type="button" onClick={() => setIncomeType("CLIENT_INVOICE")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${incomeType === "CLIENT_INVOICE" ? "bg-white dark:bg-[#262626] text-brand shadow-sm border border-[#ddd] dark:border-[#2d2d2d]" : "text-muted-foreground hover:text-foreground"}`}>
              Pago a factura de cliente
            </button>
            <button type="button" onClick={() => setIncomeType("OTHER")} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${incomeType === "OTHER" ? "bg-white dark:bg-[#262626] text-brand shadow-sm border border-[#ddd] dark:border-[#2d2d2d]" : "text-muted-foreground hover:text-foreground"}`}>
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
              ) : bills.length === 0 ? (
                <div className="flex items-center gap-3 border border-dashed border-[#ddd] dark:border-[#2d2d2d] rounded-lg px-4 py-4 text-sm text-muted-foreground">
                  <Info className="w-4 h-4 shrink-0" /> Este cliente no tiene facturas pendientes de cobro.
                </div>
              ) : (
                <div className="border border-[#ddd] dark:border-[#2d2d2d] rounded-lg overflow-hidden text-sm">
                  <table className="w-full">
                    <thead className="bg-[#F5F7FB] dark:bg-[#1a1a1a] border-b border-[#ddd] dark:border-[#2d2d2d]">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Factura</th>
                        <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Saldo pendiente</th>
                        <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Importe a pagar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ddd] dark:divide-[#2d2d2d]">
                      {bills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-[#F5F7FB] dark:hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground"><span className="text-muted-foreground">#</span>{bill.number}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">$ {bill.balance.toLocaleString("es-CO")}</td>
                          <td className="px-4 py-3 text-right"><Input type="number" defaultValue={bill.balance} className="w-32 ml-auto h-8 text-right text-sm" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Total */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#F5F7FB] dark:bg-[#1a1a1a] border border-[#ddd] dark:border-[#2d2d2d]">
            <span className="text-sm font-medium text-muted-foreground">Total del recibo</span>
            <span className="text-lg font-semibold text-foreground">$ {(clientId ? total : 0).toLocaleString("es-CO")}</span>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notas</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agrega detalles adicionales que serán visibles en la impresión." className="min-h-[88px] resize-none text-sm" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ddd] dark:border-[#2d2d2d]">
            {onClose && <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">Cancelar</Button>}
            <Button type="submit" className="h-9 px-5 text-sm bg-brand hover:bg-brand-hover text-brand-foreground font-medium border-none shadow-sm">Guardar recibo</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

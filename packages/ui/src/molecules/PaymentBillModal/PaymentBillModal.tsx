"use client";

import React, { useState } from "react";
import {
  X, Info, ExternalLink, Receipt, ChevronLeft, ChevronRight,
  Edit2, ArrowLeft, Hash, CreditCard, User, Calendar,
  ChevronDown, Building2, Tag
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentIncomeType = "CLIENT_INVOICE" | "OTHER";

export interface BankAccount { id: string; name: string; }
export interface Client { id: string; name: string; }
export interface BillOption {
  id: string;
  number: string | number;
  balance: number;
  clientId: string;
  dueDate?: string;
  total?: number;
}

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

// ─── Design atoms ─────────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, badge }: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#6C47FF]" />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
      {badge}
    </div>
  );
}

function FieldLabel({ children, required, info }: {
  children: React.ReactNode;
  required?: boolean;
  info?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
      {children}
      {required && <span className="text-[#6C47FF] font-bold leading-none">*</span>}
      {info && <Info className="w-3 h-3 text-slate-400" />}
    </label>
  );
}

function StyledInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
        focus:border-[#6C47FF] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    />
  );
}

function StyledSelect({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30 focus:border-[#6C47FF]
          appearance-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

function StyledTextarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
        focus:border-[#6C47FF] transition-all resize-none ${className}`}
    />
  );
}

const fmt = (n: number) =>
  n.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Main component ────────────────────────────────────────────────────────────

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

  const filteredBills = React.useMemo(
    () => bills.filter((b) => b.clientId === clientId),
    [bills, clientId]
  );

  React.useEffect(() => {
    const initial: Record<string, number> = {};
    filteredBills.forEach((b) => { initial[b.id] = b.balance; });
    setInvoiceAmounts(initial);
  }, [filteredBills]);

  const total = Object.values(invoiceAmounts).reduce((acc, val) => acc + (Number(val) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoicePayments = filteredBills
      .map((b) => ({ billId: b.id, amount: Number(invoiceAmounts[b.id]) || 0 }))
      .filter((p) => p.amount > 0);
    onSubmit?.({ clientId, bankAccountId, paymentDate, paymentMethod, costCenter, incomeType, invoicePayments, notes });
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Sticky navbar ── */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            {onClose && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              </>
            )}
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#6C47FF]" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Nuevo pago recibido
              </span>
              {/* Receipt number badge */}
              <div className="inline-flex items-center gap-1 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-2 py-0.5">
                <Hash className="w-3 h-3 text-[#6C47FF]" />
                <span className="text-xs font-bold text-[#6C47FF]">{receiptNumber}</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver recibo
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              form="payment-form"
              type="submit"
              className="h-8 px-4 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25"
            >
              Guardar recibo
            </button>
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">

        {/* ── 1. Header del documento ── */}
        <SectionCard>
          <div className="px-6 py-5 flex items-start justify-between gap-6">
            {/* Left: company */}
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{companyName}</p>
              <p className="text-xs text-slate-400 mt-0.5">Recibo de caja en proceso</p>
            </div>
            {/* Right: number */}
            <div className="text-right shrink-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Número</p>
              <div className="inline-flex items-center gap-1.5 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-3 py-1.5">
                <Hash className="w-3.5 h-3.5 text-[#6C47FF]" />
                <span className="text-lg font-bold text-[#6C47FF]">{receiptNumber}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 2. Datos del pago ── */}
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
          <SectionCard>
            <SectionHeader icon={CreditCard} title="Datos del pago" />
            <div className="px-6 py-5 space-y-5">

              {/* Row 1: cliente, cuenta, fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <FieldLabel>Cliente</FieldLabel>
                  <StyledSelect value={clientId} onChange={(e) => setClientId(e.target.value)}>
                    <option value="">Seleccionar cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {clients.length === 0 && <option value="" disabled>Sin clientes</option>}
                  </StyledSelect>
                </div>

                <div>
                  <FieldLabel required info>Cuenta bancaria</FieldLabel>
                  <StyledSelect value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)}>
                    <option value="">Seleccionar cuenta</option>
                    {bankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                    {bankAccounts.length === 0 && <option value="" disabled>Sin cuentas configuradas</option>}
                  </StyledSelect>
                </div>

                <div>
                  <FieldLabel required>Fecha de pago</FieldLabel>
                  <div className="relative">
                    <StyledInput
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="pr-8"
                    />
                    {paymentDate && (
                      <button
                        type="button"
                        onClick={() => setPaymentDate("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: forma de pago, centro de costo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Forma de pago</FieldLabel>
                  <StyledSelect value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="CASH">Efectivo</option>
                    <option value="TRANSFER">Transferencia bancaria</option>
                    <option value="CREDIT_CARD">Tarjeta de crédito</option>
                    <option value="DEBIT_CARD">Tarjeta de débito</option>
                    <option value="CHECK">Cheque</option>
                    <option value="DEPOSIT">Depósito bancario</option>
                    <option value="OTHER">Otro</option>
                  </StyledSelect>
                </div>

                <div>
                  <FieldLabel info>Centro de costo</FieldLabel>
                  <StyledSelect value={costCenter} onChange={(e) => setCostCenter(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="general">General</option>
                    <option value="ventas">Ventas</option>
                    <option value="operaciones">Operaciones</option>
                  </StyledSelect>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── 3. Tipo de ingreso ── */}
          <SectionCard>
            <SectionHeader icon={Tag} title="Tipo de ingreso" />
            <div className="px-6 py-5 space-y-5">

              {/* Tab toggle */}
              <div className="flex gap-2 p-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIncomeType("CLIENT_INVOICE")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                    incomeType === "CLIENT_INVOICE"
                      ? "bg-white dark:bg-slate-800 text-[#6C47FF] shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  Pago a factura de cliente
                </button>
                <button
                  type="button"
                  onClick={() => setIncomeType("OTHER")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                    incomeType === "OTHER"
                      ? "bg-white dark:bg-slate-800 text-[#6C47FF] shadow-sm border border-slate-200 dark:border-slate-700"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  Otros ingresos
                </button>
              </div>

              {/* Contenido condicional */}
              {incomeType === "CLIENT_INVOICE" && (
                <>
                  {/* Sin cliente seleccionado */}
                  {clientId === "" && (
                    <div className="flex items-start gap-3 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-4 py-3">
                      <Info className="w-4 h-4 text-[#6C47FF] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#6C47FF] dark:text-[#8B6EFF]">
                        Selecciona un cliente para ver sus facturas por cobrar.
                      </p>
                    </div>
                  )}

                  {/* Cliente sin facturas */}
                  {clientId !== "" && filteredBills.length === 0 && (
                    <div className="flex items-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl px-6 py-5 text-sm text-slate-500">
                      <Info className="w-4 h-4 shrink-0" />
                      Este cliente no tiene facturas pendientes de cobro.
                    </div>
                  )}

                  {/* Tabla de facturas */}
                  {clientId !== "" && filteredBills.length > 0 && (
                    <div>
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Facturas por cobrar</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Agrega el monto recibido a las facturas relacionadas con este ingreso.
                        </p>
                      </div>

                      {/* Table */}
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[680px]">
                            <thead>
                              <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                                {["Número", "Vencimiento", "Total", "Retenciones", "Por cobrar", "Monto recibido"].map((h, i) => (
                                  <th
                                    key={i}
                                    className={`px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 ${
                                      i === 0 ? "text-left" : i === 5 ? "text-right" : "text-center"
                                    }`}
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {filteredBills.map((bill) => {
                                const isOverdue = bill.dueDate ? new Date(bill.dueDate) < new Date() : false;
                                const formattedDate = bill.dueDate
                                  ? (() => {
                                      const [y, m, d] = bill.dueDate.split("T")[0].split("-");
                                      return `${d}/${m}/${y}`;
                                    })()
                                  : "---";

                                return (
                                  <tr key={bill.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                                    {/* Número */}
                                    <td className="px-4 py-3">
                                      <div className="inline-flex items-center gap-1 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-md px-2 py-0.5">
                                        <Hash className="w-3 h-3 text-[#6C47FF]" />
                                        <span className="text-xs font-bold text-[#6C47FF]">{bill.number}</span>
                                      </div>
                                    </td>
                                    {/* Vencimiento */}
                                    <td className="px-4 py-3 text-center">
                                      <span className={`text-sm font-medium ${isOverdue ? "text-red-500" : "text-slate-500"}`}>
                                        {formattedDate}
                                      </span>
                                      {isOverdue && (
                                        <span className="ml-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-full">
                                          Vencida
                                        </span>
                                      )}
                                    </td>
                                    {/* Total */}
                                    <td className="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                      $ {fmt(bill.total || bill.balance)}
                                    </td>
                                    {/* Retenciones */}
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <span className="text-sm text-slate-400">$</span>
                                        <div className="relative">
                                          <StyledInput
                                            type="number"
                                            defaultValue={0}
                                            className="w-24 text-right pr-8"
                                          />
                                          <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6C47FF] transition-colors"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                    {/* Por cobrar */}
                                    <td className="px-4 py-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                      $ {fmt(bill.balance)}
                                    </td>
                                    {/* Monto recibido */}
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <span className="text-sm text-slate-400">$</span>
                                        <StyledInput
                                          type="number"
                                          value={invoiceAmounts[bill.id] === undefined ? "" : invoiceAmounts[bill.id]}
                                          onChange={(e) =>
                                            setInvoiceAmounts((prev) => ({
                                              ...prev,
                                              [bill.id]: parseFloat(e.target.value),
                                            }))
                                          }
                                          className="w-28 text-right"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination footer */}
                        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-sm text-slate-400">
                          <span>{filteredBills.length > 0 ? `1–${filteredBills.length} de ${filteredBills.length}` : "0 facturas"}</span>
                          <button type="button" disabled className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" disabled className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Total card */}
                      <div className="flex justify-end mt-4">
                        <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                          <div className="px-5 py-4 flex items-center justify-between text-sm">
                            <span className="text-slate-500">Facturas seleccionadas</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {filteredBills.filter((b) => (invoiceAmounts[b.id] || 0) > 0).length}
                            </span>
                          </div>
                          <div className="px-5 py-4 bg-[#6C47FF]/5 border-t border-[#6C47FF]/15 flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total recibido</span>
                            <span className="text-2xl font-bold text-[#6C47FF]">
                              $ {fmt(clientId ? total : 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Otros ingresos — placeholder */}
              {incomeType === "OTHER" && (
                <div className="flex items-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl px-6 py-8 text-sm text-slate-400 justify-center">
                  <Info className="w-4 h-4 shrink-0" />
                  Ingresa los detalles del ingreso en las notas.
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── 4. Notas ── */}
          <SectionCard>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notas</span>
            </div>
            <div className="px-6 py-5">
              <StyledTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega detalles adicionales que serán visibles en la impresión..."
                rows={3}
              />
            </div>
          </SectionCard>

          {/* ── Bottom action row ── */}
          <div className="flex items-center justify-between py-2">
            <p className="text-xs text-slate-400">
              Los campos con <span className="text-[#6C47FF] font-bold">*</span> son obligatorios
            </p>
            <div className="flex items-center gap-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="h-9 px-5 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-2 shadow-sm shadow-[#6C47FF]/25"
              >
                Guardar recibo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { FormBillItem } from "../FormBill/FormBill";
import type { BillStatus, PaymentMethod, DianStatus } from '@domain/entities/Bill.entity';
import {
  XCircle, Terminal, Info, Printer, Download, Share2,
  Edit2, Plus, ChevronDown, ArrowLeft, Hash, FileText,
  User, Calendar, CreditCard, CheckCircle2, Clock, Ban,
  AlertCircle, ReceiptText
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

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
    clientId: string;
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

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const paymentMethodLabel: Record<string, string> = {
  CASH: "Contado", CREDIT: "Crédito", TRANSFER: "Transferencia",
  CREDIT_CARD: "Tarjeta de Crédito", DEBIT_CARD: "Tarjeta Débito", CHECK: "Cheque",
};

const paymentMethodIconLabel: Record<string, string> = {
  CASH: "Efectivo", TRANSFER: "Transferencia", CREDIT_CARD: "Tarjeta", CHECK: "Cheque",
};

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<string, {
  label: string;
  badge: string;
  ribbon: string;
  icon: React.ElementType;
}> = {
  PAID:           { label: "Pagada",       badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", ribbon: "bg-emerald-500", icon: CheckCircle2 },
  TO_PAY:         { label: "Por Cobrar",   badge: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",   ribbon: "bg-violet-500", icon: Clock },
  DRAFT:          { label: "Borrador",     badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",          ribbon: "bg-slate-400",  icon: FileText },
  CANCELLED:      { label: "Cancelada",    badge: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",                ribbon: "bg-red-500",    icon: Ban },
  PARTIALLY_PAID: { label: "Pago Parcial", badge: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",       ribbon: "bg-amber-500",  icon: AlertCircle },
  ISSUED:         { label: "Emitida",      badge: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",           ribbon: "bg-blue-500",   icon: ReceiptText },
};

const getStatus = (s: string) =>
  statusConfig[s] ?? { label: s, badge: "bg-slate-100 text-slate-600", ribbon: "bg-slate-500", icon: FileText };

// ─── Design atoms ──────────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, badge }: { icon: React.ElementType; title: string; badge?: React.ReactNode }) {
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right">{value}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

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
  const status = getStatus(formData.status as string);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white">

      {/* ── Sticky navbar ── */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden">
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
                Factura {formData.number ? `#${formData.number}` : ""}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.badge}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
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
            <button className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Compartir
            </button>
            <button className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>
            <button className="h-8 px-4 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25">
              <Plus className="w-3.5 h-3.5" />
              Agregar pago
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5 print:p-0 print:space-y-4">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          {[
            { label: "Valor total",  value: fmt(total),       color: "text-slate-800 dark:text-slate-100" },
            { label: "Retenido",     value: "0.00",           color: "text-amber-500" },
            { label: "Cobrado",      value: status.label === "Pagada" ? fmt(total) : "0.00", color: "text-emerald-500" },
            { label: "Por cobrar",   value: status.label !== "Pagada" ? fmt(total) : "0.00", color: "text-violet-500" },
          ].map(({ label, value, color }) => (
            <SectionCard key={label} className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>$ {value}</p>
            </SectionCard>
          ))}
        </div>

        {/* ── DIAN rejection banner ── */}
        {formData.dianStatus === 'REJECTED' && (
          <div className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl print:hidden">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">Factura rechazada por DIAN</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">
                <span className="font-medium">Motivo:</span> {formData.rejectedReason || "No se proporcionó un motivo específico."}
              </p>
              {formData.dianResponse && (
                <button
                  onClick={() => setShowDianModal(true)}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Ver respuesta técnica completa
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Document paper ── */}
        <SectionCard className="overflow-hidden print:border-none print:shadow-none print:rounded-none">

          {/* Status ribbon (print only) */}
          <div className="hidden print:block">
            <div className={`${status.ribbon} text-white text-xs font-bold tracking-widest py-1 text-center`}>
              {status.label.toUpperCase()}
            </div>
          </div>

          {/* Document header: logo + brand + number */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-6 relative">
            {/* Status ribbon diagonal (screen only) */}
            <div className={`absolute top-6 -left-12 transform -rotate-45 ${status.ribbon} text-white py-1 px-16 text-xs font-bold tracking-widest shadow-md print:hidden`}>
              {status.label.toUpperCase()}
            </div>

            {/* Logo */}
            <div className="w-36 h-20 shrink-0 flex items-center justify-start">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo empresa" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-4xl tracking-tighter">N.</span>
                </div>
              )}
            </div>

            {/* Center */}
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Simplapp S.A.S</p>
              <p className="text-xs text-slate-400 mt-1">NIT: 900.000.000-1</p>
            </div>

            {/* Number */}
            <div className="text-right shrink-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Número</p>
              <div className="inline-flex items-center gap-1.5 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-3 py-1.5">
                <Hash className="w-3.5 h-3.5 text-[#6C47FF]" />
                <span className="text-lg font-bold text-[#6C47FF]">{formData.number || "Auto"}</span>
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
              <InfoRow label="Nombre" value={<span className="font-semibold">{formData.clientName || "Consumidor Final"}</span>} />
              <InfoRow label="Identificación" value={formData.clientId} />
              <InfoRow label="Correo" value={formData.email} />
            </div>

            {/* Dates */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#6C47FF]" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fechas y pago</span>
              </div>
              <InfoRow label="Creación" value={new Date(formData.date).toLocaleDateString("es-CO")} />
              <InfoRow label="Vencimiento" value={new Date(formData.dueDate).toLocaleDateString("es-CO")} />
              <InfoRow
                label="Plazo"
                value={
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.badge}`}>
                    {paymentMethodLabel[formData.paymentMethod] ?? formData.paymentMethod}
                  </span>
                }
              />
            </div>
          </div>

          {/* Items table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                  {["Ítem / Referencia", "Cant.", "Precio", "Desc %", "Imp %", "Total"].map((h, i) => (
                    <th
                      key={i}
                      className={`px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 ${i === 0 ? "text-left" : "text-right"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">Sin ítems</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.productName || item.name}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-400">$ {fmt(item.price)}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-400">{item.discount}%</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-400">{item.taxRate}%</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-800 dark:text-slate-200">$ {fmt(item.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">$ {fmt(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Descuentos</span>
                    <span className="font-medium text-red-500">− $ {fmt(discountTotal)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Impuestos</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">$ {fmt(taxTotal)}</span>
                </div>
              </div>
              <div className="px-5 py-4 bg-[#6C47FF]/5 border-t border-[#6C47FF]/15 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total General</span>
                <span className="text-2xl font-bold text-[#6C47FF]">$ {fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Notas adicionales</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                {formData.notes || "Sin notas."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Términos y condiciones</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                {formData.terms || "Esta factura se rige bajo los términos convencionales de pago."}
              </p>
            </div>
          </div>

          {/* Footer note */}
          {formData.footerNote && (
            <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-medium">{formData.footerNote}</p>
            </div>
          )}
        </SectionCard>

        {/* ── Payments history ── */}
        {payments && payments.length > 0 && (
          <SectionCard className="print:hidden">
            <SectionHeader
              icon={CreditCard}
              title="Historial de pagos"
              badge={
                <span className="text-xs font-semibold text-[#6C47FF] bg-[#6C47FF]/10 px-2 py-0.5 rounded-full ml-1">
                  {payments.length}
                </span>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                    {["Fecha", "Recibo / Ref", "Método", "Cuenta / Caja", "Monto"].map((h, i) => (
                      <th
                        key={i}
                        className={`px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 ${i === 4 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {new Date(payment.date).toLocaleDateString("es-CO")}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#6C47FF]">
                        {payment.receiptNumber || payment.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {paymentMethodIconLabel[payment.method] ?? payment.method}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {payment.account?.name || "No asociada"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-800 dark:text-slate-200">
                        $ {fmt(Number(payment.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

      </div>

      {/* ── DIAN modal ── */}
      {showDianModal && formData.dianResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 w-full max-w-2xl shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Respuesta Técnica DIAN</h3>
              </div>
              <button
                onClick={() => setShowDianModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-black/50 rounded-xl p-4 border border-zinc-800 font-mono text-xs leading-relaxed text-zinc-300">
                <pre className="whitespace-pre-wrap break-all">
                  {(() => {
                    try { return JSON.stringify(JSON.parse(formData.dianResponse), null, 2); }
                    catch { return formData.dianResponse; }
                  })()}
                </pre>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <Info className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Esta es la respuesta cruda enviada por los servidores de la DIAN.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowDianModal(false)}
                className="h-9 px-5 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
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
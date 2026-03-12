"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, X, CreditCard, ChevronDown, Loader2 } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: {
    id: string;
    clientName?: string | null;
    number: string | number;
    balance: string | number;
  } | null;
  onSubmit: (payment: {
    date: string;
    bankAccount: string;
    value: string | number;
    paymentMethod: string;
    billId: string;
  }) => void;
  /** Callback al pulsar "Ir a formulario avanzado" */
  onAdvanced?: () => void;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
      {children}
      {required && <span className="ml-1 text-[#6C47FF] font-bold">*</span>}
    </label>
  );
}

const StyledInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
          focus:border-[#6C47FF] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      />
    );
  }
);
StyledInput.displayName = 'StyledInput';

function StyledSelect({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
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

// ─── Main component ───────────────────────────────────────────────────────────

export function PaymentModal({ isOpen, onClose, bill, onSubmit, onAdvanced }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    bankAccount: "caja_general",
    value: "",
    paymentMethod: "CASH",
  });

  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Cargar cuentas bancarias
  useEffect(() => {
    if (isOpen) {
      setIsLoadingAccounts(true);
      fetch('/api/bank-accounts')
        .then(res => res.json())
        .then(({ data }) => {
          setAccounts(data || []);
          if (data?.length > 0) {
            setFormData(prev => ({ ...prev, bankAccount: data[0].id }));
          }
        })
        .catch(err => console.error("Error fetching bank accounts:", err))
        .finally(() => setIsLoadingAccounts(false));
    }
  }, [isOpen]);

  // Actualizar valor por defecto cuando cambia el bill
  useEffect(() => {
    if (bill?.balance) {
      setFormData(prev => ({ ...prev, value: String(bill.balance) }));
    }
  }, [bill]);

  // Foco automático
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen || !bill) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    // Simular un poco de carga para feedback visual
    setTimeout(() => {
      onSubmit({ 
        ...formData, 
        bankAccount: formData.bankAccount === "none" ? "" : formData.bankAccount, 
        billId: bill.id 
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-110 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Container */}
      <div className="fixed inset-0 flex items-center justify-center z-120 pointer-events-none p-4">
        <div 
          className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6C47FF]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4 text-[#6C47FF]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  Registrar Pago
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {bill.clientName || 'Sin cliente'} — Factura #{bill.number}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-5 py-5 space-y-4">
              
              {/* Información del saldo */}
              <div className="p-3 bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100/50 dark:border-violet-800/30 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500/80 mb-0.5">Saldo pendiente</p>
                <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                  $ {Number(bill.balance).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <FieldLabel required>Fecha</FieldLabel>
                  <StyledInput 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-1">
                  <FieldLabel required>Monto</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                    <StyledInput 
                      ref={firstInputRef}
                      type="number" 
                      className="pl-6"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <FieldLabel required>Método</FieldLabel>
                  <StyledSelect
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option value="CASH">Efectivo</option>
                    <option value="TRANSFER">Transferencia</option>
                    <option value="CREDIT_CARD">Tarjeta</option>
                  </StyledSelect>
                </div>
                <div className="col-span-1">
                  <FieldLabel required>Caja/Cuenta</FieldLabel>
                  <StyledSelect
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    disabled={isSubmitting || isLoadingAccounts}
                  >
                    {isLoadingAccounts ? (
                      <option>Cargando...</option>
                    ) : accounts.length === 0 ? (
                      <option value="none">Sin cuentas</option>
                    ) : (
                      accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))
                    )}
                  </StyledSelect>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-3">
              {onAdvanced ? (
                <button
                  type="button"
                  onClick={onAdvanced}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#6C47FF] hover:text-[#5835E8] transition-colors disabled:opacity-50 group"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  Avanzado
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 px-4 rounded-lg text-xs font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...</>
                  ) : (
                    'Agregar pago'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

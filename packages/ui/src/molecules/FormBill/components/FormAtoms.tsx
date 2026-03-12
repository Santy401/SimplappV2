"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { BillStatus } from "@domain/entities/Bill.entity";

// ─── Constants ────────────────────────────────────────────────────────────────

export const statusColors: Record<BillStatus, string> = {
  DRAFT:          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  ISSUED:         "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  PAID:           "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  PARTIALLY_PAID: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED:      "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  TO_PAY:         "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
};

export const statusLabels: Record<BillStatus, string> = {
  DRAFT: "Borrador",
  ISSUED: "Emitida",
  PAID: "Pagada",
  PARTIALLY_PAID: "Pago Parcial",
  CANCELLED: "Cancelada",
  TO_PAY: "Por Pagar",
};

export const fmt = (n: number) =>
  n.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Atoms ──────────────────────────────────────────────────────────────────

export function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
  badge,
}: {
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

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
      {children}
      {required && <span className="ml-1 text-[#6C47FF] font-bold">*</span>}
    </label>
  );
}

export function StyledInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
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

export function StyledSelect({
  className = "",
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

export function StyledTextarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
        focus:border-[#6C47FF] transition-all resize-none
        disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    />
  );
}

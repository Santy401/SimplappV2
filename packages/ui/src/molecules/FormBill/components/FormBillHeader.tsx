"use client";

import React from "react";
import { ArrowLeft, FileText, Eye, Save, Send } from "lucide-react";
import { statusColors, statusLabels } from "./FormAtoms";
import type { BillStatus } from "@domain/entities/Bill.entity";

interface FormBillHeaderProps {
  mode: "create" | "edit" | "view";
  status: BillStatus;
  billNumber?: string | number;
  isLoading: boolean;
  itemsCount: number;
  onBack: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onEmitBill: () => void;
}

export function FormBillHeader({
  mode,
  status,
  billNumber,
  isLoading,
  itemsCount,
  onBack,
  onPreview,
  onSaveDraft,
  onEmitBill,
}: FormBillHeaderProps) {
  const isEditable = mode === "create" || mode === "edit";

  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: back + title + status badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6C47FF]" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {mode === "create"
                ? "Nueva Factura"
                : mode === "edit"
                ? "Editar Factura"
                : `Factura #${billNumber || ""}`}
            </span>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            disabled={isLoading || itemsCount === 0}
            className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye className="w-3.5 h-3.5" />
            Previsualizar
          </button>
          {isEditable && (
            <>
              <button
                onClick={onSaveDraft}
                disabled={isLoading}
                className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-3.5 h-3.5" />
                {isLoading ? "Guardando..." : "Borrador"}
              </button>
              <button
                onClick={onEmitBill}
                disabled={isLoading || itemsCount === 0}
                className="h-8 px-4 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {isLoading
                  ? "Emitiendo..."
                  : mode === "edit"
                  ? "Actualizar"
                  : "Emitir factura"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Eye, Save, Send } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  isEditable: boolean;
  itemsCount: number;
  mode: "create" | "edit" | "view";
  onBack: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onEmitBill: () => void;
}

export function FormActions({
  isLoading,
  isEditable,
  itemsCount,
  mode,
  onBack,
  onPreview,
  onSaveDraft,
  onEmitBill,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs text-slate-400">
        Los campos con <span className="text-[#6C47FF] font-bold">*</span> son obligatorios
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400
            border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800
            transition-colors disabled:opacity-40"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onPreview}
          disabled={isLoading || itemsCount === 0}
          className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400
            border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800
            transition-colors flex items-center gap-2 disabled:opacity-40"
        >
          <Eye className="w-4 h-4" />
          Previsualizar
        </button>
        {isEditable && (
          <>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isLoading}
              className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400
                border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800
                transition-colors flex items-center gap-2 disabled:opacity-40"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Guardando..." : "Guardar borrador"}
            </button>
            <button
              type="button"
              onClick={onEmitBill}
              disabled={isLoading || itemsCount === 0}
              className="h-9 px-5 rounded-lg text-sm font-semibold text-white bg-[#6C47FF]
                hover:bg-[#5835E8] transition-colors flex items-center gap-2
                shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              {isLoading
                ? "Emitiendo..."
                : mode === "edit"
                ? "Actualizar factura"
                : "Emitir factura"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

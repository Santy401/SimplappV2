"use client";

import React from "react";
import { Pen, Upload } from "lucide-react";
import { fmt } from "./FormAtoms";

interface TotalsSignatureSectionProps {
  signature: string | undefined;
  isEditable: boolean;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  signatureInputRef: React.RefObject<HTMLInputElement | null>;
  onSignatureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TotalsSignatureSection({
  signature,
  isEditable,
  subtotal,
  discountTotal,
  taxTotal,
  total,
  signatureInputRef,
  onSignatureChange,
}: TotalsSignatureSectionProps) {
  return (
    <div className="flex flex-col md:flex-row items-start gap-5">
      {/* Signature */}
      <div className="flex-1">
        <input
          ref={signatureInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={onSignatureChange}
        />
        <button
          type="button"
          onClick={() => isEditable && signatureInputRef.current?.click()}
          className={`group relative flex items-center justify-center border-2 border-dashed
            border-slate-200 dark:border-slate-700 rounded-xl transition-colors overflow-hidden
            w-full max-w-xs h-28
            ${isEditable ? "hover:border-[#6C47FF]/40 cursor-pointer" : "cursor-default"}
            ${signature ? "border-none" : ""}`}
        >
          {signature ? (
            <>
              <img src={signature} alt="Firma digital" className="w-full h-full object-contain" />
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              )}
            </>
          ) : (
            <div className={`flex flex-col items-center gap-1.5 text-slate-400 transition-colors ${isEditable ? "group-hover:text-[#6C47FF]" : ""}`}>
              <Pen className="w-5 h-5" />
              <span className="text-xs font-medium">Firma digital</span>
              <span className="text-xs text-slate-300">.png o .jpg</span>
            </div>
          )}
        </button>
        <div className="mt-2 h-px w-full max-w-xs bg-slate-200 dark:bg-slate-800" />
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mt-1.5 max-w-xs text-center">
          Elaborado por
        </p>
      </div>

      {/* Totals */}
      <div className="w-full md:w-72">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">$ {fmt(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Descuento</span>
                <span className="font-medium text-red-500">− $ {fmt(discountTotal)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Impuestos</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">$ {fmt(taxTotal)}</span>
            </div>
          </div>
          <div className="px-5 py-4 bg-[#6C47FF]/5 border-t border-[#6C47FF]/15 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total</span>
            <span className="text-2xl font-bold text-[#6C47FF]">$ {fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

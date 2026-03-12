'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Percent, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';

interface BillingStepProps {
  data: any;
  updateData: (updates: any) => void;
  onFinish: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function BillingStep({ data, updateData, onFinish, onBack, isLoading }: BillingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Configuración de Facturación</h2>
        <p className="text-slate-500 dark:text-slate-400">Prepara el sistema para emitir tus primeros documentos.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Prefijo de Factura</label>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={data.invoicePrefix}
              onChange={(e) => updateData({ invoicePrefix: e.target.value.toUpperCase() })}
              placeholder="Ej: FAC"
              maxLength={4}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all uppercase"
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-medium">Este código identificará tus series de facturación (Ej: {data.invoicePrefix}-001).</p>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Impuesto por Defecto (%)</label>
          <div className="relative">
            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              value={data.defaultTax}
              onChange={(e) => updateData({ defaultTax: e.target.value })}
              placeholder="19"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-medium">Se aplicará automáticamente a tus productos y servicios.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="h-12 px-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>
        <button
          onClick={onFinish}
          disabled={isLoading || !data.invoicePrefix}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Finalizando...</>
          ) : (
            <>Completar Configuración <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
}

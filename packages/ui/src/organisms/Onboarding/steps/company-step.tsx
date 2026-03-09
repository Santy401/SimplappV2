'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Banknote, UploadCloud, ChevronRight, ArrowLeft } from 'lucide-react';

interface CompanyStepProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CompanyStep({ data, updateData, onNext, onBack }: CompanyStepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateData({ companyLogo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Detalles de tu Negocio</h2>
        <p className="text-slate-500 dark:text-slate-400">Esta información aparecerá en tus facturas y reportes.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nombre comercial</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => updateData({ companyName: e.target.value })}
              placeholder="Ej: Innova Tech S.A.S"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">País</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={data.country}
                onChange={(e) => updateData({ country: e.target.value })}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none"
              >
                <option value="Colombia">Colombia</option>
                <option value="México">México</option>
                <option value="Chile">Chile</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Moneda</label>
            <div className="relative">
              <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={data.currency}
                onChange={(e) => updateData({ currency: e.target.value })}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none"
              >
                <option value="COP">COP ($)</option>
                <option value="USD">USD ($)</option>
                <option value="MXN">MXN ($)</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Identidad Visual (Logo)</label>
          <label className="group relative flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-purple-500/50 hover:bg-purple-50/10 transition-all cursor-pointer overflow-hidden">
            {data.companyLogo ? (
              <>
                <img src={data.companyLogo} alt="Logo preview" className="h-full w-full object-contain p-4" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <UploadCloud className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center px-4">
                <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subir logo empresarial</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG o JPG • Máx 2MB</p>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6">
        <button
          onClick={onBack}
          className="h-12 px-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!data.companyName.trim()}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

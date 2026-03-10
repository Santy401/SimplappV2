'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react';

interface SuccessStepProps {
  onFinish: () => void;
}

export function SuccessStep({ onFinish }: SuccessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner relative">
        <CheckCircle2 className="w-10 h-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 text-emerald-400"
        >
          <PartyPopper className="w-6 h-6 opacity-50" />
        </motion.div>
      </div>
      
      <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">
        ¡Todo listo!
      </h2>
      
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-12">
        Tu espacio de trabajo ha sido configurado con éxito. Ya puedes comenzar a gestionar tu negocio.
      </p>

      <button
        onClick={onFinish}
        className="group relative w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 overflow-hidden"
      >
        <span className="relative z-10">Ir al Dashboard</span>
        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
      
      <p className="mt-6 text-xs text-slate-400 font-medium uppercase tracking-widest">
        Empieza creando tu primera factura o producto
      </p>
    </motion.div>
  );
}

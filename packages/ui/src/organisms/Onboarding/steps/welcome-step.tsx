'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 bg-purple-600/10 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
        <Rocket className="w-10 h-10" />
      </div>
      
      <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">
        Bienvenido a Simplapp
      </h2>
      
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-12">
        La plataforma todo en uno para llevar tu negocio al siguiente nivel de eficiencia y control.
      </p>

      <button
        onClick={onNext}
        className="group relative w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-3 overflow-hidden"
      >
        <span className="relative z-10">Comenzar configuración</span>
        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
      
      <p className="mt-6 text-xs text-slate-400 font-medium uppercase tracking-widest">
        Configura tu espacio en menos de 2 minutos
      </p>
    </motion.div>
  );
}

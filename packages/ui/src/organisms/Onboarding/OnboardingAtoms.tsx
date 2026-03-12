'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, ShieldCheck, Zap } from 'lucide-react';

// ─── Info Panel (Left Side) ──────────────────────────────────────────────────

export function OnboardingInfoPanel() {
  const features = [
    { icon: Zap, title: 'Gestión en tiempo real', desc: 'Controla tus ventas e inventarios desde cualquier lugar.' },
    { icon: ShieldCheck, title: 'Facturación Electrónica', desc: 'Cumple con la DIAN de forma automática y segura.' },
    { icon: Rocket, title: 'Escalabilidad', desc: 'Diseñado para crecer con tu empresa, sin límites.' }
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-purple-700 to-indigo-900 text-white w-[40%] min-h-screen">
      <div>
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-purple-700 font-black text-2xl tracking-tighter">S.</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Simplapp</span>
        </div>

        <div className="space-y-10 mt-20">
          <h1 className="text-4xl font-extrabold leading-tight">
            Estás a unos pasos de <br /> 
            <span className="text-purple-300">modernizar tu negocio.</span>
          </h1>
          
          <div className="space-y-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <f.icon className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{f.title}</h3>
                  <p className="text-purple-100/70 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/10">
        <p className="text-xs text-purple-200/50 font-medium tracking-widest uppercase">
          Confianza en cada transacción • 2026
        </p>
      </div>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

export function OnboardingProgressBar({ progress, stepLabel }: { progress: number; stepLabel: string }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{stepLabel}</span>
        <span className="text-xs font-black text-purple-600 dark:text-purple-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
        />
      </div>
    </div>
  );
}

// ─── Card Option (Selection) ─────────────────────────────────────────────────

interface CardOptionProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
}

export function CardOption({ selected, onClick, icon: Icon, title, description }: CardOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 text-left
        ${selected 
          ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 shadow-xl shadow-purple-500/10' 
          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md'
        }`}
    >
      <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors
        ${selected ? 'bg-purple-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-purple-500'}
      `}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-purple-900 dark:text-purple-100' : 'text-slate-700 dark:text-slate-300'}`}>
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>

      {selected && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-5 h-5 text-purple-600" />
        </div>
      )}
    </button>
  );
}

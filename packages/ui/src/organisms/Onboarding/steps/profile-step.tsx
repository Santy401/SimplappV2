'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle2, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { CardOption } from '../OnboardingAtoms';

interface ProfileStepProps {
  userType: string;
  onSelect: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProfileStep({ userType, onSelect, onNext, onBack }: ProfileStepProps) {
  const options = [
    {
      id: 'Emprendedor',
      title: 'Emprendedor / Independiente',
      desc: 'Para personas que gestionan sus propias ventas, servicios y gastos personales.',
      icon: UserCircle2
    },
    {
      id: 'Empresa',
      title: 'Empresa / Negocio',
      desc: 'Para organizaciones con múltiples bodegas, empleados y requisitos de facturación avanzada.',
      icon: Building2
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">¿Cómo usarás Simplapp?</h2>
        <p className="text-slate-500 dark:text-slate-400">Personalizaremos tu experiencia según tu perfil.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => (
          <CardOption
            key={opt.id}
            selected={userType === opt.id}
            onClick={() => onSelect(opt.id)}
            icon={opt.icon}
            title={opt.title}
            description={opt.desc}
          />
        ))}
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
          disabled={!userType}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

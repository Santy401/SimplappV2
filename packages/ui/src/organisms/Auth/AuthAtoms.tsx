'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, Zap, Rocket, BarChart3, Globe, Activity } from 'lucide-react';
import { cn } from '../../utils/utils';

// ─── Auth Card Container ─────────────────────────────────────────────────────

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "w-full max-w-[460px] bg-white dark:bg-slate-950 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-slate-900 p-8 md:p-12 relative overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

// ─── Info Section (Left Side - Carousel) ──────────────────────────────────────

const SLIDES = [
  {
    icon: Zap,
    title: "Velocidad Extrema",
    desc: "Factura en segundos con nuestra interfaz optimizada. Menos clics, más ventas.",
    accent: "text-purple-300",
    bgIcon: Rocket
  },
  {
    icon: ShieldCheck,
    title: "Seguridad Bancaria",
    desc: "Tus datos y los de tus clientes protegidos con encriptación de grado militar.",
    accent: "text-emerald-300",
    bgIcon: Globe
  },
  {
    icon: BarChart3,
    title: "Inteligencia de Negocio",
    desc: "Toma decisiones basadas en datos reales. Gráficas y reportes al instante.",
    accent: "text-blue-300",
    bgIcon: Activity
  }
];

export function AuthInfoSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#6C47FF] to-[#4318FF] text-white w-[45%] h-screen sticky top-0 left-0 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-[#6C47FF] font-black text-2xl tracking-tighter">S.</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Simplapp</span>
        </div>

        <div className="mt-24 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                <slide.icon className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-5xl font-black leading-tight tracking-tighter max-w-md">
                {slide.title.split(' ')[0]} <br />
                <span className={slide.accent}>{slide.title.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <p className="text-purple-100/70 text-lg leading-relaxed max-w-sm">
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 pt-12 border-t border-white/10 flex items-center justify-between">
        <p className="text-[10px] text-purple-200/40 font-black tracking-[0.3em] uppercase">
          Technology for Business • 2026
        </p>
        
        {/* Carousel Indicators */}
        <div className="flex gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                current === i ? "w-8 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Password Strength Indicator ─────────────────────────────────────────────

interface PasswordRequirementProps {
  label: string;
  met: boolean;
}

export function PasswordRequirement({ label, met }: PasswordRequirementProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-[11px] font-bold transition-colors duration-300",
      met ? "text-emerald-500" : "text-slate-400"
    )}>
      <div className={cn(
        "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
        met ? "bg-emerald-500 text-white scale-110" : "bg-slate-100 dark:bg-slate-800"
      )}>
        {met ? <Check size={10} strokeWidth={4} /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
      </div>
      <span className="tracking-tight">{label}</span>
    </div>
  );
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const reqs = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Una mayúscula", met: /[A-Z]/.test(password) },
    { label: "Un número", met: /[0-9]/.test(password) },
    { label: "Un carácter especial", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-y-3 gap-x-4">
      {reqs.map((r, i) => (
        <PasswordRequirement key={i} {...r} />
      ))}
    </div>
  );
}

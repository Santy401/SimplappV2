'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function LandingCTA({ country }: { country: string }) {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#4318FF] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-balance">
            ¿Listo para llevar tu negocio al siguiente nivel?
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Únete a las empresas que ya están facturando y gestionando sus inventarios de forma inteligente con Simplapp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/${country}/Register`}
              className="group relative h-14 px-8 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10">Crear cuenta gratis</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="h-14 px-8 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center w-full sm:w-auto"
            >
              Leer documentación
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

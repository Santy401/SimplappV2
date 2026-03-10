'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, Package, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../../utils/utils';

export function LandingBentoGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Todo lo que necesitas, <span className="text-purple-600">sin complicaciones.</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Simplapp no es un sistema contable aburrido. Es una plataforma de inteligencia de negocios diseñada para emprendedores y empresas modernas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {/* Bento Box 1: Facturación */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-6">
              <FileText className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Facturación Electrónica DIAN</h3>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Cumple con todas las normativas locales sin esfuerzo. Emite facturas, notas crédito y documentos soporte en segundos.
            </p>
          </div>
        </motion.div>

        {/* Bento Box 2: Inventario */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-slate-100 rounded-[32px] p-8 relative overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Control de Stock</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Alertas de bajo inventario y gestión multi-bodega en tiempo real.
            </p>
          </div>
        </motion.div>

        {/* Bento Box 3: Dashboard */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-slate-100 rounded-[32px] p-8 relative overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Dashboard Modular</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Personaliza tu panel con arrastrar y soltar. Visualiza tus KPIs más importantes.
            </p>
          </div>
        </motion.div>

        {/* Bento Box 4: Seguridad */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 bg-purple-50 border border-purple-100/50 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-xl shadow-purple-500/10 flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 text-purple-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-purple-900 mb-2 tracking-tight">Seguridad de Grado Bancario</h3>
            <p className="text-purple-700/70 max-w-md leading-relaxed">
              Tus datos y los de tus clientes están protegidos. Sistema Multi-tenant para separar los entornos de cada empresa de forma hermética.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

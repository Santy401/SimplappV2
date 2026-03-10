'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, RefreshCcw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* ── Background Decorations ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-xl w-full text-center relative z-10">
        {/* ── Animated 404 Glass Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative mb-12"
        >
          <div className="text-[180px] md:text-[240px] font-black leading-none tracking-tighter text-slate-200/50 dark:text-slate-800/30 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-gradient-to-br from-[#6C47FF] to-[#4318FF] shadow-2xl shadow-purple-500/40 flex items-center justify-center p-[1px]"
            >
              <div className="w-full h-full rounded-[39px] bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-black text-6xl md:text-7xl tracking-tighter">S.</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Text Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Parece que te has <br />
            <span className="text-[#6C47FF]">salido del camino.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            La página que buscas no existe o ha sido movida a una nueva ubicación en nuestro ecosistema.
          </p>
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="group relative h-14 px-8 bg-[#6C47FF] hover:bg-[#5835E8] text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-3 overflow-hidden w-full sm:w-auto"
          >
            <Home size={18} />
            <span>Volver al inicio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="h-14 px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <RefreshCcw size={18} className="text-slate-400" />
            Reintentar
          </button>
        </motion.div>

        {/* ── Helpful Links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-wrap justify-center gap-x-8 gap-y-4"
        >
          <Link href="/docs" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#6C47FF] transition-colors">Documentación</Link>
          <Link href="/co/Login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#6C47FF] transition-colors">Soporte Técnico</Link>
          <Link href="/co" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#6C47FF] transition-colors">Estado del Sistema</Link>
        </motion.div>
      </div>

      {/* ── Footer Label ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[10px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-[0.4em]">
          Simplapp Enterprise • Error 404
        </p>
      </div>
    </div>
  );
}

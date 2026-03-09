'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AuthInfoSection } from './AuthAtoms';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  backHref?: string;
}

export function AuthLayout({ children, backHref }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Left: Info Section */}
      <AuthInfoSection />

      {/* Right: Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Back button */}
        {backHref && (
          <Link 
            href={backHref}
            className="absolute top-8 left-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#6C47FF] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:border-purple-200">
                <ArrowLeft size={14} />
            </div>
            <span>Volver</span>
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full flex justify-center py-12"
        >
          {children}
        </motion.div>

        {/* Footer info mobile */}
        <div className="mt-auto lg:hidden pt-8 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Simplapp Enterprise • 2026
            </p>
        </div>
      </div>
    </div>
  );
}

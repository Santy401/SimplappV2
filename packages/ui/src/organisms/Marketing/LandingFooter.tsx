'use client';

import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#4318FF] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm tracking-tighter">S.</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">Simplapp Enterprise</span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link href="/docs" className="hover:text-[#6C47FF] transition-colors">
            Documentación
          </Link>
          <Link href="#" className="hover:text-[#6C47FF] transition-colors">
            Términos
          </Link>
          <Link href="#" className="hover:text-[#6C47FF] transition-colors">
            Privacidad
          </Link>
        </nav>

        <p className="text-xs text-slate-400 font-medium">
          &copy; {currentYear} Simplapp. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

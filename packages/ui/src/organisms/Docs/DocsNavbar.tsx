'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/utils';

interface DocsNavbarProps {
  onMenuClick?: () => void;
}

export function DocsNavbar({ onMenuClick }: DocsNavbarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C47FF] to-[#4318FF] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm tracking-tighter">S.</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">Docs</span>
          </Link>
        </div>

        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/docs" className="text-sm font-medium text-slate-900 dark:text-white">Guías</Link>
          <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">API Reference</Link>
          <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Changelog</Link>
        </nav>

        <div className="flex items-center">
          <Link 
            href="/co/Login" 
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors"
          >
            Ir a la App
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C47FF] to-[#4318FF] origin-left"
        style={{ scaleX }}
      />
    </header>
  );
}

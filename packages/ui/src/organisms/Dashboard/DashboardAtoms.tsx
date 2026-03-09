'use client';

import React from 'react';
import { cn } from '../../utils/utils';

export const currencyFormat = (val: number) => {
  if (val === undefined || val === null || isNaN(val)) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(val);
};

export function DashboardCard({ children, className, glowColor = 'none' }: any) {
  const glowStyles = {
    purple: 'after:bg-purple-500/5',
    emerald: 'after:bg-emerald-500/5',
    orange: 'after:bg-orange-500/5',
    blue: 'after:bg-blue-500/5',
    none: ''
  } as any;

  return (
    <div className={cn(
      "relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl",
      glowColor !== 'none' && `after:absolute after:top-0 after:right-0 after:w-32 after:h-32 after:rounded-full after:blur-[60px] after:pointer-events-none ${glowStyles[glowColor]}`,
      className
    )}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function DashboardSectionHeader({ title, description, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h3>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

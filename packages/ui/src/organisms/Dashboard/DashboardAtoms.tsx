'use client';

import React from 'react';
import { cn } from '../../utils/utils';

// ─── Formatting Utils ────────────────────────────────────────────────────────

export const currencyFormat = (val: number) => {
  if (val === undefined || val === null || isNaN(val)) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(val);
};

// ─── Dashboard Card ──────────────────────────────────────────────────────────

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'emerald' | 'orange' | 'blue' | 'none';
}

export function DashboardCard({ children, className, glowColor = 'none' }: DashboardCardProps) {
  const glowStyles = {
    purple: 'after:bg-purple-500/5',
    emerald: 'after:bg-emerald-500/5',
    orange: 'after:bg-orange-500/5',
    blue: 'after:bg-blue-500/5',
    none: ''
  };

  return (
    <div className={cn(
      "relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-black/20",
      glowColor !== 'none' && `after:absolute after:top-0 after:right-0 after:w-32 after:h-32 after:rounded-full after:blur-[60px] after:pointer-events-none ${glowStyles[glowColor as keyof typeof glowStyles]}`,
      className
    )}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ─── Dashboard Grid ──────────────────────────────────────────────────────────

export function DashboardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {children}
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────

export function DashboardSectionHeader({ title, description, icon: Icon }: { title: string; description?: string; icon?: React.ElementType }) {
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

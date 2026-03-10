'use client';

import React from 'react';
import { cn } from '../../utils/utils';

// ─── Settings Section ────────────────────────────────────────────────────────

export function SettingsSection({ title, description, children, className }: { 
  title: string; 
  description?: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500", className)}>
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// ─── Settings Group (Card) ───────────────────────────────────────────────────

export function SettingsGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}

// ─── Field Layout ─────────────────────────────────────────────────────────────

export function SettingsField({ label, description, children, error }: { 
  label: string; 
  description?: string; 
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</label>
          {description && <p className="text-xs text-slate-400 font-medium">{description}</p>}
        </div>
        <div className="w-full md:w-2/3 max-w-md">
          {children}
          {error && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tighter">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

export function SettingsAction({ label, onClick, variant = 'primary', isLoading, disabled }: {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[#6C47FF] hover:bg-[#5835E8] text-white shadow-purple-500/20",
    secondary: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "h-10 px-6 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        styles[variant]
      )}
    >
      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : label}
    </button>
  );
}

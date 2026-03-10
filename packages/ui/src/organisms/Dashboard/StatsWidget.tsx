'use client';

import React from 'react';
<<<<<<< HEAD
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { DashboardCard, currencyFormat } from './DashboardAtoms';
import { cn } from '../../utils/utils';

interface StatsWidgetProps {
  title: string;
  value: number | string;
  type?: 'currency' | 'number';
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconColor?: 'emerald' | 'orange' | 'blue' | 'purple' | 'rose';
  subValue?: string;
  glow?: boolean;
}

export function StatsWidget({
  title,
  value,
  type = 'number',
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'purple',
  subValue,
  glow = true
}: StatsWidgetProps) {
  const isPositive = trend !== undefined && trend >= 0;
  
=======
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardCard, currencyFormat } from './DashboardAtoms';
import { cn } from '../../utils/utils';

export function StatsWidget({ title, value, type = 'number', trend, trendLabel, icon: Icon, iconColor = 'purple', subValue, glow = true }: any) {
  const isPositive = trend !== undefined && trend >= 0;
>>>>>>> feat/rebuild-ui-components
  const iconColors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    orange:  'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    blue:    'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    purple:  'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    rose:    'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
<<<<<<< HEAD
  };
=======
  } as any;
>>>>>>> feat/rebuild-ui-components

  const formattedValue = type === 'currency' ? currencyFormat(Number(value)) : value;

  return (
<<<<<<< HEAD
    <DashboardCard glowColor={glow ? iconColor as any : 'none'}>
=======
    <DashboardCard glowColor={glow ? iconColor : 'none'}>
>>>>>>> feat/rebuild-ui-components
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300", iconColors[iconColor])}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</span>
      </div>
<<<<<<< HEAD

      <div className="space-y-1">
        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
          {formattedValue}
        </h3>
        
        <div className="flex items-center gap-2 min-h-[24px]">
          {trend !== undefined ? (
            <span className={cn(
              "flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-full",
              isPositive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          ) : null}
          
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate">
            {trendLabel || subValue}
          </span>
=======
      <div className="space-y-1">
        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{formattedValue}</h3>
        <div className="flex items-center gap-2 min-h-[24px]">
          {trend !== undefined && (
            <span className={cn("flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-full", isPositive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30" : "bg-rose-50 text-rose-700 dark:bg-rose-900/30")}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          <span className="text-xs font-medium text-slate-400 truncate">{trendLabel || subValue}</span>
>>>>>>> feat/rebuild-ui-components
        </div>
      </div>
    </DashboardCard>
  );
}

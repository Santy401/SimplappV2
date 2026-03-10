'use client';

import React from 'react';
import { Receipt, ArrowUpRight } from 'lucide-react';
<<<<<<< HEAD
import { DashboardCard, DashboardSectionHeader, currencyFormat } from './DashboardAtoms';
import { cn } from '../../utils/utils';

interface ActivityItem {
  id: string;
  prefix: string;
  number: number;
  clientName: string;
  total: number;
  status: string;
  date: string;
}

interface RecentActivityWidgetProps {
  title: string;
  items: ActivityItem[];
  onViewAll?: () => void;
}

export function RecentActivityWidget({ title, items, onViewAll }: RecentActivityWidgetProps) {
  const formatShortName = (name: string) => {
    if (!name) return "Consumidor Final";
    const parts = name.split(" ");
    if (parts.length > 2) return `${parts[0]} ${parts[parts.length - 1]}`;
    return name;
  };

  return (
    <DashboardCard className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all cursor-pointer shadow-sm"
          >
=======
import { DashboardCard, currencyFormat } from './DashboardAtoms';
import { cn } from '../../utils/utils';

export function RecentActivityWidget({ title, items, onViewAll }: any) {
  const formatShortName = (name: string) => {
    if (!name) return "Consumidor Final";
    const parts = name.split(" ");
    return parts.length > 2 ? `${parts[0]} ${parts[parts.length - 1]}` : name;
  };

  return (
    <DashboardCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-600 transition-all shadow-sm">
>>>>>>> feat/rebuild-ui-components
            <ArrowUpRight size={18} />
          </button>
        )}
      </div>
<<<<<<< HEAD

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <Receipt size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Sin actividad reciente</p>
          <p className="text-xs text-slate-400 mt-1">Tus nuevas facturas aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-purple-50/30 dark:hover:bg-purple-900/5 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center transition-colors group-hover:bg-purple-600 group-hover:border-purple-500">
                  <span className="text-[10px] text-slate-400 font-black uppercase leading-none mb-1 group-hover:text-purple-200">
                    {item.prefix || 'FAC'}
                  </span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 leading-none group-hover:text-white">
                    {item.number}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px] group-hover:text-slate-900 dark:group-hover:text-white">
                    {formatShortName(item.clientName)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(item.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {currencyFormat(item.total)}
                </div>
                <div className={cn(
                  "text-[9px] uppercase font-black px-2 py-0.5 rounded-full inline-block mt-1 tracking-tighter",
                  item.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                )}>
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
=======
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center group-hover:bg-purple-600 transition-colors">
                <span className="text-[10px] text-slate-400 font-black uppercase leading-none group-hover:text-purple-200">{item.prefix || 'FAC'}</span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-white">{item.number}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px] group-hover:text-slate-900 dark:group-hover:text-white">{formatShortName(item.clientName)}</span>
                <span className="text-xs font-medium text-slate-400">{new Date(item.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{currencyFormat(item.total)}</div>
              <div className={cn("text-[9px] uppercase font-black px-2 py-0.5 rounded-full inline-block mt-1", item.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600")}>{item.status}</div>
            </div>
          </div>
        ))}
      </div>
>>>>>>> feat/rebuild-ui-components
    </DashboardCard>
  );
}

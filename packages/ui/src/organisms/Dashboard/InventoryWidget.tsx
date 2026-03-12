'use client';

import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { DashboardCard, DashboardSectionHeader } from './DashboardAtoms';
import { cn } from '../../utils/utils';

export function InventoryWidget({ title, items, className }: any) {
  return (
    <DashboardCard className={cn("flex flex-col h-full", className)}>
      <DashboardSectionHeader title={title} icon={Package} />
      <div className="space-y-4 mt-2">
        {items.length === 0 ? (
          <div className="py-10 text-center"><p className="text-sm text-slate-400">Todo tu inventario está al día.</p></div>
        ) : (
          items.map((item: any) => {
            const ratio = (item.stock / (item.minStock * 2)) * 100;
            const color = item.stock <= item.minStock ? 'bg-rose-500' : 'bg-amber-500';
            return (
              <div key={item.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition-colors">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    {item.stock <= item.minStock && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                    <span className={cn("text-xs font-black", item.stock <= item.minStock ? "text-rose-600" : "text-slate-500")}>{item.stock} unidades</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${Math.min(ratio, 100)}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardCard>
  );
}

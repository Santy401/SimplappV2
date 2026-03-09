'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Wallet, Users, BarChart3, Activity, Package, Layout as LayoutIcon, Save, Plus, X, GripVertical, TrendingUp, PieChart, ListChecks } from 'lucide-react';
import { Responsive, Layout as GridLayout } from 'react-grid-layout';
import { StatsWidget } from './StatsWidget';
import { DashboardChart } from './DashboardChart';
import { RecentActivityWidget } from './RecentActivityWidget';
import { InventoryWidget } from './InventoryWidget';
import { cn } from '../../utils/utils';

const gridStyles = `
  .react-grid-layout { position: relative; transition: height 300ms ease; width: 100% !important; }
  .react-grid-item { transition: all 200ms ease; transition-property: left, top; z-index: 1; }
  .react-grid-item.dragging { z-index: 100 !important; transition: none !important; }
  .react-resizable-handle { position: absolute; width: 20px; height: 20px; bottom: 0; right: 0; cursor: nwse-resize; z-index: 10; }
  .react-resizable-handle::after { content: ""; position: absolute; right: 8px; bottom: 8px; width: 8px; height: 8px; border-right: 2px solid #6C47FF; border-bottom: 2px solid #6C47FF; opacity: 0; transition: opacity 0.2s; }
  .react-grid-item:hover .react-resizable-handle::after { opacity: 0.5; }
  .drag-handle { cursor: grab; }
`;

const AVAILABLE_WIDGETS = [
  { type: 'stats', title: 'Ventas Totales', icon: DollarSign, color: 'emerald' },
  { type: 'stats', title: 'Clientes Nuevos', icon: Users, color: 'blue' },
  { type: 'chart', title: 'Análisis de Área', icon: TrendingUp, color: 'purple', variant: 'area' },
  { type: 'chart', title: 'Distribución Pie', icon: PieChart, color: 'pink', variant: 'pie' },
  { type: 'inventory', title: 'Stock Crítico', icon: Package, color: 'rose' },
  { type: 'activity', title: 'Actividad Reciente', icon: ListChecks, color: 'orange' },
];

export function Dashboard({ userName = "Administrador", initialWidgets, initialLayout, onSaveLayout, metrics }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [widgets, setWidgets] = useState<any[]>(initialWidgets || []);
  const [layout, setLayout] = useState<GridLayout[]>(initialLayout || []);
  const [width, setWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateWidth = () => { if (containerRef.current) setWidth(containerRef.current.clientWidth); };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => { window.removeEventListener('resize', updateWidth); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (isMounted && !initialWidgets && metrics && widgets.length === 0) {
      const defaultWidgets = [
        { id: 'sales', type: 'stats', title: 'Ventas Mes', props: { value: metrics.totals.currentSales, type: 'currency', trend: metrics.totals.salesGrowth, icon: DollarSign, iconColor: 'emerald' } },
        { id: 'receivable', type: 'stats', title: 'Por Cobrar', props: { value: metrics.totals.pendingBillsValue, type: 'currency', subValue: `${metrics.totals.pendingBillsCount} facturas`, icon: Wallet, iconColor: 'orange' } },
        { id: 'clients', type: 'stats', title: 'Clientes', props: { value: metrics.totals.totalClients, subValue: 'Registrados', icon: Users, iconColor: 'blue' } },
        { id: 'chart', type: 'chart', title: 'Crecimiento', props: { data: metrics.monthlySales, variant: 'area' } },
        { id: 'activity', type: 'activity', title: 'Recientes', props: { items: metrics.recentBills } },
      ];
      const defaultLayout = [
        { i: 'sales', x: 0, y: 0, w: 1, h: 2 },
        { i: 'receivable', x: 1, y: 0, w: 1, h: 2 },
        { i: 'clients', x: 2, y: 0, w: 1, h: 2 },
        { i: 'chart', x: 0, y: 2, w: 3, h: 6 },
        { i: 'activity', x: 3, y: 0, w: 1, h: 8 },
      ];
      setWidgets(defaultWidgets);
      setLayout(defaultLayout);
    }
  }, [isMounted, initialWidgets, metrics]);

  const addWidget = (template: any) => {
    const id = `w-${Date.now()}`;
    const newWidget = { id, type: template.type, title: template.title, props: template.type === 'chart' ? { data: metrics?.monthlySales || [], variant: template.variant, icon: template.icon } : template.type === 'stats' ? { value: 0, icon: template.icon, iconColor: template.color } : { items: [] } };
    setWidgets(prev => [...prev, newWidget]);
    setLayout(prev => [...prev, { i: id, x: 0, y: Infinity, w: template.type === 'chart' ? 2 : 1, h: template.type === 'chart' ? 6 : 2 }]);
  };

  const removeWidget = (id: string) => { setWidgets(widgets.filter(w => w.id !== id)); setLayout(layout.filter(l => l.i !== id)); };

  if (!isMounted) return null;

  return (
    <div className="w-full pb-20 animate-in fade-in duration-500 max-w-[1600px] mx-auto space-y-8 px-4">
      <style>{gridStyles}</style>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 text-[10px] font-black tracking-[0.2em] rounded-full uppercase"><Activity size={12} /> Espacio de Inteligencia</div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white">Dashboard <span className="text-slate-300 dark:text-slate-700 font-light">/</span> {userName.split(" ")[0]}</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"><LayoutIcon size={18} className="text-purple-500" /> Personalizar</button>
          ) : (
            <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setIsEditing(false)} className="h-12 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={() => { setIsEditing(false); onSaveLayout?.(layout, widgets); }} className="h-12 px-8 rounded-2xl bg-[#6C47FF] text-white text-sm font-black shadow-lg shadow-purple-500/25 hover:bg-[#5835E8] transition-all flex items-center gap-2"><Save size={18} /> Guardar</button>
            </div>
          )}
        </div>
      </header>
      {isEditing && (
        <div className="mx-2 p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] animate-in fade-in zoom-in-95 duration-300">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Módulos Disponibles</p>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_WIDGETS.map((temp, i) => (
              <button key={i} onClick={() => addWidget(temp)} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-purple-500 hover:shadow-xl transition-all group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", `bg-${temp.color}-50 text-${temp.color}-600 dark:bg-${temp.color}-900/20`)}><temp.icon size={20} /></div>
                <div className="text-left pr-2"><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{temp.title}</p><p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">Añadir</p></div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div ref={containerRef} className="relative w-full">
        <Responsive className="layout" layouts={{ lg: layout }} breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} cols={{ lg: 4, md: 2, sm: 2, xs: 1, xxs: 1 }} rowHeight={60} width={width} isDraggable={isEditing} isResizable={isEditing} draggableHandle=".drag-handle" onLayoutChange={(l) => setLayout(l)} margin={[32, 32]} containerPadding={[0, 0]} compactType="vertical">
          {widgets.map((widget: any) => (
            <div key={widget.id} className="group/item relative">
              {isEditing && (
                <div className="absolute top-4 right-4 z-50 flex gap-1.5 animate-in fade-in scale-90">
                  <button className="drag-handle w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-purple-600 shadow-xl transition-all"><GripVertical size={16} /></button>
                  <button onClick={() => removeWidget(widget.id)} className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-500 hover:bg-rose-50 shadow-xl transition-all"><X size={16} /></button>
                </div>
              )}
              <div className={cn("h-full", isEditing && "opacity-60 pointer-events-none")}>
                {widget.type === 'stats' && <StatsWidget title={widget.title} {...widget.props} glow={!isEditing} />}
                {widget.type === 'chart' && <DashboardChart title={widget.title} {...widget.props} height="100%" className="h-full" />}
                {widget.type === 'activity' && <RecentActivityWidget title={widget.title} {...widget.props} className="h-full" />}
                {widget.type === 'inventory' && <InventoryWidget title={widget.title} {...widget.props} className="h-full" />}
              </div>
            </div>
          ))}
        </Responsive>
      </div>
    </div>
  );
}

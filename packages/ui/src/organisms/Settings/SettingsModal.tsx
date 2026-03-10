'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Building2, Shield, Bell, 
  CreditCard, Landmark, ReceiptText, ChevronRight 
} from 'lucide-react';
import { cn } from '../../utils/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SettingsView = 
  | 'perfil' | 'empresa' | 'seguridad' 
  | 'notificaciones' | 'facturacion' 
  | 'bancos' | 'suscripcion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: SettingsView;
  onViewChange: (view: SettingsView) => void;
  children: React.ReactNode;
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

function SidebarItem({ 
  id, label, icon: Icon, active, onClick 
}: { 
  id: SettingsView; 
  label: string; 
  icon: any; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between h-11 px-4 rounded-2xl transition-all duration-300 group",
        active 
          ? "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 shadow-sm" 
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={cn("transition-transform group-hover:scale-110", active && "scale-110")} />
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 shadow-lg shadow-purple-500/50" />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SettingsModal({ isOpen, onClose, currentView, onViewChange, children }: SettingsModalProps) {
  
  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const menuItems: { id: SettingsView; label: string; icon: any; section: string }[] = [
    { id: 'perfil', label: 'Mi Perfil', icon: User, section: 'Cuenta' },
    { id: 'seguridad', label: 'Seguridad', icon: Shield, section: 'Cuenta' },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, section: 'Cuenta' },
    { id: 'empresa', label: 'Empresa', icon: Building2, section: 'Organización' },
    { id: 'facturacion', label: 'Config. Facturación', icon: ReceiptText, section: 'Organización' },
    { id: 'bancos', label: 'Cuentas Bancarias', icon: Landmark, section: 'Organización' },
    { id: 'suscripcion', label: 'Plan & Suscripción', icon: CreditCard, section: 'Organización' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-6xl h-[85vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-2xl flex overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar */}
              <aside className="w-72 border-r border-slate-100 dark:border-slate-900 flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
                <div className="p-8 pb-4">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ajustes</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Configuración Global</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
                  {['Cuenta', 'Organización'].map((section) => (
                    <div key={section} className="space-y-2">
                      <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{section}</h4>
                      <div className="space-y-1">
                        {menuItems.filter(i => i.section === section).map((item) => (
                          <SidebarItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            icon={item.icon}
                            active={currentView === item.id}
                            onClick={() => onViewChange(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>

                <div className="p-6">
                  <button 
                    onClick={onClose}
                    className="w-full h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    Cerrar Ajustes
                  </button>
                </div>
              </aside>

              {/* Content Area */}
              <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 relative">
                {/* Header Stickiness */}
                <div className="absolute top-0 right-0 p-8 z-20">
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 md:p-16 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentView}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

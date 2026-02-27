"use client";

import React from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, User, Building2, Receipt, Activity, Shield, Bell, CreditCard } from 'lucide-react';
import { cn } from '@simplapp/ui';
import { ActivityLogViewer } from './ActivityLogViewer';
import { ProfileSettings } from './ProfileSettings';
import { CompanySettings } from './CompanySettings';
import { BillingSettings } from './BillingSettings';
import { SubscriptionSettings } from './SubscriptionSettings';

export function SettingsModal() {
    const { isOpen, isMaximized, currentView, setCurrentView, closeSettings, toggleMaximized } = useSettings();

    const sidebarItems = [
        { id: 'perfil', label: 'Perfil', icon: User },
        { id: 'empresa', label: 'Empresa', icon: Building2 },
        { id: 'suscripcion', label: 'Planes y Suscripción', icon: CreditCard },
        { id: 'facturacion', label: 'Facturación y DIAN', icon: Receipt },
        { id: 'actividad', label: 'Registro de Actividad', icon: Activity },
        { id: 'seguridad', label: 'Seguridad', icon: Shield },
        { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    ] as const;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSettings}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            width: isMaximized ? '100vw' : '90vw',
                            height: isMaximized ? '100vh' : '85vh',
                            maxWidth: isMaximized ? '100vw' : '1200px',
                            borderRadius: isMaximized ? '0rem' : '1rem'
                        }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className={cn(
                            "relative bg-white dark:bg-slate-950 flex overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10"
                        )}
                    >
                        {/* Sidebar */}
                        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
                            <div className="h-14 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                                <span className="font-semibold text-lg">Ajustes</span>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentView(item.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                            currentView === item.id
                                                ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content pane */}
                        <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-950">
                            {/* Header */}
                            <div className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
                                <h2 className="font-medium text-lg">
                                    {sidebarItems.find(item => item.id === currentView)?.label}
                                </h2>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleMaximized}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={closeSettings}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* View Content */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-transparent">
                                {currentView === 'perfil' && <ProfileSettings />}
                                {currentView === 'empresa' && <CompanySettings />}
                                {currentView === 'suscripcion' && <SubscriptionSettings />}
                                {currentView === 'facturacion' && <BillingSettings />}
                                {currentView === 'actividad' && <ActivityLogViewer />}
                                {currentView === 'seguridad' && <div>Opciones de seguridad aquí...</div>}
                                {currentView === 'notificaciones' && <div>Opciones de notificaciones aquí...</div>}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

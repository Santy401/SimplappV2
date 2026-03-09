"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
    Home,
    TrendingUp,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Inbox,
    Settings,
    LayoutDashboard,
    LogOut,
} from "lucide-react"
import { cn } from "../../utils/utils"

interface NavItem {
    id: string
    label: string
    icon: React.ReactNode
    submenu?: NavItem[]
    badge?: number | string
}

interface SidebarProps {
    onSelect?: (id: string) => void
    currentView?: string
    isMobileOpen?: boolean
    onCloseMobile?: () => void
}

export function Sidebar({ onSelect, currentView, isMobileOpen, onCloseMobile }: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>(["ventas"])
    const [isPinned, setIsPinned] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    const isExpanded = isPinned || isHovered

    const toggleSubmenu = (id: string) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    const navItems: NavItem[] = [
        { id: "inicio", label: "Inicio", icon: <LayoutDashboard size={20} /> },
        {
            id: "ventas",
            label: "Ventas",
            icon: <TrendingUp size={20} />,
            submenu: [
                { id: "ventas-facturacion", label: "Facturación", icon: null },
                { id: "ventas-pagos", label: "Pagos Recibidos", icon: null },
                { id: "ventas-clientes", label: "Clientes", icon: null },
                { id: "ventas-productos", label: "Productos de Venta", icon: null },
                { id: "ventas-vendedor", label: "Vendedores", icon: null },
            ],
        },
        {
            id: "Inventario",
            label: "Inventario",
            icon: <Inbox size={20} />,
            submenu: [
                { id: "inventario-precios", label: "Lista de Precios", icon: null },
                { id: "inventario-bodega", label: "Bodega / Stock", icon: null },
            ]
        },
    ]

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 sm:hidden animate-in fade-in duration-300"
                    onClick={onCloseMobile}
                />
            )}
            <div
                className={cn(
                    "h-screen z-[100] transition-all duration-500 ease-in-out flex-shrink-0",
                    "fixed sm:sticky top-0 left-0",
                    isPinned ? "sm:w-64" : "sm:w-20",
                    isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full sm:translate-x-0"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={cn(
                        "absolute top-0 left-0 h-screen border-r flex flex-col overflow-hidden transition-all duration-500",
                        "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800",
                        isExpanded || isMobileOpen ? "w-64" : "w-20",
                        !isPinned && isHovered && "shadow-[20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.3)]"
                    )}
                >
                    {/* ── Header / Logo ── */}
                    <div className="h-[72px] px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C47FF] via-[#5835E8] to-[#4318FF] p-[1px] shadow-lg shadow-purple-500/20 shrink-0">
                                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
                                    <span className="text-white font-black text-xl tracking-tighter">S</span>
                                </div>
                            </div>
                            {(isExpanded || isMobileOpen) && (
                                <div className="flex flex-col animate-in fade-in slide-in-from-left-2 gap-1 duration-500">
                                    <span className="text-slate-900 dark:text-white font-black text-xl tracking-tighter leading-none">Simplapp</span>
                                    <span className="text-[10px] text-purple-500 font-bold uppercase tracking-[0.2em] mt-0.5">Enterprise</span>
                                </div>
                            )}
                        </div>
                        {(isExpanded || isMobileOpen) && (
                            <button
                                onClick={() => setIsPinned(!isPinned)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-purple-600 hidden sm:block"
                            >
                                {isPinned ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </button>
                        )}
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = currentView === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentView));
                            const isExpandedItem = expandedItems.includes(item.id);

                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (item.submenu) {
                                                toggleSubmenu(item.id);
                                            } else {
                                                onSelect?.(item.id);
                                            }
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between h-11 px-3 rounded-xl transition-all duration-300 group relative",
                                            isActive 
                                                ? "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-500/5" 
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                                isActive ? "bg-white dark:bg-slate-800 shadow-sm" : "group-hover:scale-110"
                                            )}>
                                                {item.icon}
                                            </div>
                                            {(isExpanded || isMobileOpen) && (
                                                <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.label}</span>
                                            )}
                                        </div>

                                        {(isExpanded || isMobileOpen) && item.submenu && (
                                            <ChevronDown size={14} className={cn("transition-transform duration-300", isExpandedItem ? "rotate-180" : "")} />
                                        )}
                                        
                                        {!isExpanded && !isMobileOpen && isActive && (
                                            <div className="absolute left-0 w-1 h-6 bg-purple-600 rounded-r-full" />
                                        )}
                                    </button>

                                    {item.submenu && (isExpanded || isMobileOpen) && (
                                        <div className={cn(
                                            "grid transition-all duration-300 ease-in-out",
                                            isExpandedItem ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                                        )}>
                                            <div className="overflow-hidden ml-4 pl-4 border-l border-slate-100 dark:border-slate-800 space-y-1">
                                                {item.submenu.map((subitem) => (
                                                    <button
                                                        key={subitem.id}
                                                        onClick={() => onSelect?.(subitem.id)}
                                                        className={cn(
                                                            "w-full flex items-center h-9 px-3 text-xs font-semibold rounded-lg transition-all duration-200",
                                                            currentView === subitem.id
                                                                ? "text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/5"
                                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                        )}
                                                    >
                                                        {subitem.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* ── Footer / Actions ── */}
                    <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-900 space-y-1">
                        <button 
                            className="w-full flex items-center h-11 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
                            onClick={() => onSelect?.('settings')}
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                                <Settings size={20} />
                            </div>
                            {(isExpanded || isMobileOpen) && (
                                <span className="text-sm font-bold tracking-tight ml-3">Configuración</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

"use client"

import type React from "react"
import { useState } from "react"
import {
    Home,
    BarChart3,
    TrendingUp,
    Bell,
    Globe,
    Newspaper,
    LineChart,
    Vault,
    Wallet,
    AlertCircle,
    Search,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Inbox,
} from "lucide-react"
import { cn } from "../utils/utils"

interface NavItem {
    id: string
    label: string
    icon: React.ReactNode
    href?: string
    submenu?: NavItem[]
    badge?: number | string
    variant?: "default" | "active"
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
        { id: "inicio", label: "Inicio", icon: <Home size={20} /> },
        {
            id: "ventas",
            label: "Ventas",
            icon: <TrendingUp size={20} />,
            submenu: [
                { id: "ventas-facturacion", label: "Facturacion", icon: null },
                { id: "ventas-clientes", label: "Clientes", icon: null },
                { id: "ventas-productos", label: "Productos De Venta", icon: null },
                { id: "ventas-vendedor", label: "Vendedores", icon: null },
            ],
        },
        {
            id: "Inventario",
            label: "Inventario",
            icon: <Inbox size={20} />,
            submenu: [
                { id: "inventario-precios", label: "Lista Precios", icon: null },
                { id: "inventario-bodega", label: "Bodega", icon: null },
            ]
        },
    ]

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity"
                    onClick={onCloseMobile}
                />
            )}
            <div
                className={cn(
                    "h-screen z-100 transition-transform duration-300 flex-shrink-0 outline-none",
                    "fixed sm:sticky top-0 left-0",
                    isPinned ? "sm:w-62" : "sm:w-22",
                    isMobileOpen ? "translate-x-0 w-62" : "-translate-x-full sm:translate-x-0"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={cn(
                        "absolute top-0 left-0 h-screen border-r border-sidebar-border flex flex-col font-sans overflow-hidden transition-all duration-300 z-50",
                        "bg-white text-slate-700 dark:bg-slate-950 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-slate-300",
                        isExpanded || isMobileOpen ? "w-62" : "w-22",
                        !isPinned && isHovered && "shadow-2xl shadow-black/10 dark:shadow-black/30"
                    )}
                >
                    <div className="border-b h-[56px] border-sidebar-border py-1 px-6 flex items-center box-border">
                        <div className="flex items-center justify-between gap-2 overflow-hidden w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-200">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                {isExpanded && <span className="text-foreground font-bold text-lg tracking-tight whitespace-nowrap">Simplapp</span>}
                            </div>
                            {isExpanded && (
                                <button
                                    onClick={() => {
                                        const newPinnedState = !isPinned;
                                        setIsPinned(newPinnedState);
                                        if (!newPinnedState) {
                                            setIsHovered(false);
                                        }
                                    }}
                                    className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
                                    title={isPinned ? "Ocultar sidebar" : "Fijar sidebar"}
                                >
                                    {isPinned ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                                </button>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                        {navItems.map((item) => (
                            <div key={item.id}>
                                <button
                                    onClick={() => {
                                        if (item.submenu) {
                                            const isExpanding = !expandedItems.includes(item.id);
                                            toggleSubmenu(item.id)
                                            if (isExpanding && item.submenu.length > 0) {
                                                onSelect?.(item.submenu[0].id)
                                            }
                                        } else {
                                            onSelect?.(item.id)
                                        }
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between py-2 px-6 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                        currentView === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentView))
                                            ? "text-purple-400 bg-purple-500/5 font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-purple-500"
                                            : "hover:bg-forground text-foreground-text hover:foreground-text-second00",
                                    )}
                                    title={!isExpanded ? item.label : undefined}
                                >
                                    <div className="flex items-center gap-4 w-fit">
                                        <div
                                            className={cn(
                                                "flex items-center justify-center flex-shrink-0",
                                                currentView === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentView)) ? "text-purple-400" : "group-hover:text-purple-400/60",
                                            )}
                                        >
                                            {item.icon}
                                        </div>
                                        {isExpanded && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                                    </div>

                                    {isExpanded && (
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {item.badge && (
                                                <span
                                                    className={cn(
                                                        "text-xs font-semibold px-2 py-1 rounded-full",
                                                        item.badge === "●" ? "text-green-400 bg-transparent" : "bg-purple-500/20 text-purple-300",
                                                    )}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.submenu &&
                                                (expandedItems.includes(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                        </div>
                                    )}
                                </button>
                                {item.submenu && (
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            isExpanded && expandedItems.includes(item.id)
                                                ? "max-h-[500px] opacity-100 mt-2"
                                                : "max-h-0 opacity-0 mt-0"
                                        )}
                                    >
                                        <div className="ml-4 space-y-1 pl-3">
                                            {item.submenu.map((subitem) => (
                                                <button
                                                    key={subitem.id}
                                                    onClick={() => {
                                                        onSelect?.(subitem.id)
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer rounded-lg transition-all duration-200 relative overflow-hidden",
                                                        currentView === subitem.id
                                                            ? "text-purple-400 bg-purple-500/10 font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-purple-500/50"
                                                            : "text-foreground-text hover:bg-purple-500/5 hover:text-purple-300"
                                                    )}
                                                >
                                                    {subitem.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="relative border-sidebar-border space-y-1 py-4 px-1 flex items-center h-[64px] box-border">
                        <div className="flex items-center gap-3">
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Home, TrendingUp, ChevronDown, ChevronRight, ChevronLeft, Inbox, } from "lucide-react";
import { cn } from "../../utils/utils";
export function Sidebar({ onSelect, currentView, isMobileOpen, onCloseMobile }) {
    const [expandedItems, setExpandedItems] = useState(["ventas"]);
    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = isPinned || isHovered;
    const toggleSubmenu = (id) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };
    const navItems = [
        { id: "inicio", label: "Inicio", icon: _jsx(Home, { size: 20 }) },
        {
            id: "ventas",
            label: "Ventas",
            icon: _jsx(TrendingUp, { size: 20 }),
            submenu: [
                { id: "ventas-facturacion", label: "Facturacion", icon: null },
                { id: "ventas-pagos", label: "Pagos Recibidos", icon: null },
                { id: "ventas-clientes", label: "Clientes", icon: null },
                { id: "ventas-productos", label: "Productos De Venta", icon: null },
                { id: "ventas-vendedor", label: "Vendedores", icon: null },
            ],
        },
        {
            id: "Inventario",
            label: "Inventario",
            icon: _jsx(Inbox, { size: 20 }),
            submenu: [
                { id: "inventario-precios", label: "Lista Precios", icon: null },
                { id: "inventario-bodega", label: "Bodega", icon: null },
            ]
        },
    ];
    return (_jsxs(_Fragment, { children: [isMobileOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity", onClick: onCloseMobile })), _jsx("div", { className: cn("h-screen z-100 transition-transform duration-300 flex-shrink-0 outline-none", "fixed sm:sticky top-0 left-0", isPinned ? "sm:w-62" : "sm:w-22", isMobileOpen ? "translate-x-0 w-62" : "-translate-x-full sm:translate-x-0"), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: _jsxs("div", { className: cn("absolute top-0 left-0 h-screen border-r border-sidebar-border flex flex-col font-sans overflow-hidden transition-all duration-300 z-50", "bg-white text-slate-700 dark:bg-slate-950 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-slate-300", isExpanded || isMobileOpen ? "w-62" : "w-22", !isPinned && isHovered && "shadow-2xl shadow-black/10 dark:shadow-black/30"), children: [_jsx("div", { className: "border-b h-[56px] border-sidebar-border py-1 px-6 flex items-center box-border", children: _jsxs("div", { className: "flex items-center justify-between gap-2 overflow-hidden w-full", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-200", children: _jsx("span", { className: "text-white font-bold text-sm", children: "S" }) }), isExpanded && _jsx("span", { className: "text-foreground font-bold text-lg tracking-tight whitespace-nowrap", children: "Simplapp" })] }), isExpanded && (_jsx("button", { onClick: () => {
                                            const newPinnedState = !isPinned;
                                            setIsPinned(newPinnedState);
                                            if (!newPinnedState) {
                                                setIsHovered(false);
                                            }
                                        }, className: "p-1 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-300", title: isPinned ? "Ocultar sidebar" : "Fijar sidebar", children: isPinned ? _jsx(ChevronLeft, { size: 18 }) : _jsx(ChevronRight, { size: 18 }) }))] }) }), _jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-4 space-y-1", children: navItems.map((item) => (_jsxs("div", { children: [_jsxs("button", { onClick: () => {
                                            if (item.submenu) {
                                                const isExpanding = !expandedItems.includes(item.id);
                                                toggleSubmenu(item.id);
                                                if (isExpanding && item.submenu.length > 0) {
                                                    onSelect?.(item.submenu[0].id);
                                                }
                                            }
                                            else {
                                                onSelect?.(item.id);
                                            }
                                        }, className: cn("w-full flex items-center justify-between py-2 px-6 rounded-lg transition-all duration-200 group relative overflow-hidden", currentView === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentView))
                                            ? "text-purple-400 bg-purple-500/5 font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-purple-500"
                                            : "hover:bg-forground text-foreground-text hover:foreground-text-second00"), title: !isExpanded ? item.label : undefined, children: [_jsxs("div", { className: "flex items-center gap-4 w-fit", children: [_jsx("div", { className: cn("flex items-center justify-center flex-shrink-0", currentView === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentView)) ? "text-purple-400" : "group-hover:text-purple-400/60"), children: item.icon }), isExpanded && _jsx("span", { className: "text-sm font-medium whitespace-nowrap", children: item.label })] }), isExpanded && (_jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [item.badge && (_jsx("span", { className: cn("text-xs font-semibold px-2 py-1 rounded-full", item.badge === "â—" ? "text-green-400 bg-transparent" : "bg-purple-500/20 text-purple-300"), children: item.badge })), item.submenu &&
                                                        (expandedItems.includes(item.id) ? _jsx(ChevronDown, { size: 16 }) : _jsx(ChevronRight, { size: 16 }))] }))] }), item.submenu && (_jsx("div", { className: cn("overflow-hidden transition-all duration-300 ease-in-out", isExpanded && expandedItems.includes(item.id)
                                            ? "max-h-[500px] opacity-100 mt-2"
                                            : "max-h-0 opacity-0 mt-0"), children: _jsx("div", { className: "ml-4 space-y-1 pl-3", children: item.submenu.map((subitem) => (_jsx("button", { onClick: () => {
                                                    onSelect?.(subitem.id);
                                                }, className: cn("w-full flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer rounded-lg transition-all duration-200 relative overflow-hidden", currentView === subitem.id
                                                    ? "text-purple-400 bg-purple-500/10 font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-purple-500/50"
                                                    : "text-foreground-text hover:bg-purple-500/5 hover:text-purple-300"), children: subitem.label }, subitem.id))) }) }))] }, item.id))) }), _jsx("div", { className: "relative border-sidebar-border space-y-1 py-4 px-1 flex items-center h-[64px] box-border", children: _jsx("div", { className: "flex items-center gap-3" }) })] }) })] }));
}

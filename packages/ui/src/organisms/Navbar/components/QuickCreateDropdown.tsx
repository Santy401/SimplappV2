"use client"

import React from "react"
import { 
    Plus, User, Package, Store, UserCheck, Tag, FileText 
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../atoms/DropdownMenu/dropdown-menu"
import { QuickActionType } from "../../../hooks/useQuickActions"

interface QuickCreateDropdownProps {
    onOpenAction: (type: QuickActionType) => void;
    onSelectView?: (view: string) => void;
}

export const QuickCreateDropdown = ({ onOpenAction, onSelectView }: QuickCreateDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-10 px-4 flex items-center justify-center gap-2 bg-[#6C47FF] text-white rounded-xl hover:bg-[#5835E8] transition-all shadow-lg shadow-purple-500/20 group">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Crear</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Creación Rápida</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3" onClick={() => onSelectView?.('ventas-facturacion-create')}>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <FileText size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Factura de Venta</span>
                        <span className="text-[10px] text-slate-400">Ir al formulario</span>
                    </div>
                </DropdownMenuItem>

                <div className="h-px bg-slate-50 dark:bg-slate-900 my-1 mx-2" />

                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3" onClick={() => onOpenAction('client')}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                        <User size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Nuevo Cliente</span>
                        <span className="text-[10px] text-slate-400">Registro rápido</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3" onClick={() => onOpenAction('product')}>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                        <Package size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Nuevo Producto</span>
                        <span className="text-[10px] text-slate-400">Catálogo de venta</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3" onClick={() => onOpenAction('store')}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                        <Store size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Nueva Bodega</span>
                        <span className="text-[10px] text-slate-400">Punto de stock</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3" onClick={() => onOpenAction('seller')}>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                        <UserCheck size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Nuevo Vendedor</span>
                        <span className="text-[10px] text-slate-400">Gestión de ventas</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3" onClick={() => onOpenAction('listPrice')}>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                        <Tag size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Nueva Lista</span>
                        <span className="text-[10px] text-slate-400">Categoría de precios</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

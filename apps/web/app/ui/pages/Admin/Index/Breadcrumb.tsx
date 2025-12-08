"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const SIDEBAR_ITEMS = [
    { id: "inicio", label: "Inicio" },
    { id: "dashboard", label: "Dashboard" },
    { id: "ventas", label: "Ventas" },
    { id: "ventas-venta", label: "Comprobante De Venta", parentId: "ventas" },
    { id: "ventas-cotizaciones", label: "Cotizaciones", parentId: "ventas" },
    { id: "ventas-remisiones", label: "Remisiones", parentId: "ventas" },
    { id: "ventas-clientes", label: "Clientes", parentId: "ventas" },
    { id: "ventas-clientes-create", label: "Crear Cliente", parentId: "ventas-clientes" },
    { id: "ventas-clientes-create", label: "Crear Cliente", parentId: "ventas-clientes" },
    { id: "ventas-productos", label: "Productos De Venta", parentId: "ventas" },
    { id: "ventas-vendedor", label: "Vendedores", parentId: "ventas" }
];

interface BreadcrumbProps {
    activeItem?: string;
}

export default function Breadcrumb({ activeItem }: BreadcrumbProps) {
    const pathname = usePathname();
    
    const detectedItem = !activeItem ? detectActiveItem(pathname) : activeItem;
    const currentItem = SIDEBAR_ITEMS.find(item => item.id === detectedItem);

    if (!currentItem || detectedItem === 'inicio') {
        return (
            <div className="text-gray-400 flex items-center">
                <span className="text-white font-medium">Simplapp</span>
            </div>
        );
    }

    const breadcrumbItems = getBreadcrumbChain(currentItem);

    return (
        <div className="text-gray-400 flex items-center flex-wrap gap-1">
            <span className="text-foreground font-medium">Simplapp</span>
            
            {breadcrumbItems.map((item, index) => (
                <div key={item.id} className="flex items-center">
                    <ChevronRight width={16} height={16} className="mx-1 text-gray-500" />
                    <span className={`${index === breadcrumbItems.length - 1 ? 'text-foreground-text-second font-medium' : 'text-gray-400'}`}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function detectActiveItem(pathname: string): string {
    const path = pathname.toLowerCase();
    
    if (path.includes('/ventas/clientes/create')) return 'ventas-clientes-create';
    if (path.includes('/ventas/clientes')) return 'ventas-clientes';
    if (path.includes('/ventas/Vendedores')) return 'ventas-vendedor'
    if (path.includes('/ventas/cotizaciones')) return 'ventas-cotizaciones';
    if (path.includes('/ventas/remisiones')) return 'ventas-remisiones';
    if (path.includes('/ventas/venta')) return 'ventas-venta';
    if (path.includes('/ventas')) return 'ventas';
    if (path.includes('/dashboard')) return 'dashboard';
    
    return 'inicio';
}

function getBreadcrumbChain(currentItem: any): any[] {
    const chain = [currentItem];
    let parentId = currentItem.parentId;
    
    while (parentId) {
        const parentItem = SIDEBAR_ITEMS.find(item => item.id === parentId);
        if (parentItem) {
            chain.unshift(parentItem);
            parentId = parentItem.parentId;
        } else {
            break;
        }
    }
    
    return chain;
}
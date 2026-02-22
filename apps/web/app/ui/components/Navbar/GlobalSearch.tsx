"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
    Search,
    X,
    Home,
    BarChart3,
    TrendingUp,
    Inbox,
    FileText,
    Users,
    Package,
    User,
    Store,
    Receipt,
    Tag,
    ArrowRight,
} from "lucide-react"
import { cn } from "@simplapp/ui"

interface SearchResult {
    id: string
    label: string
    description: string
    icon: React.ReactNode
    category: string
}

// Catálogo de vistas navegables que se pueden buscar
const SEARCHABLE_ITEMS: SearchResult[] = [
    { id: "inicio", label: "Inicio", description: "Página principal", icon: <Home size={18} />, category: "General" },
    { id: "dashboard", label: "Dashboard", description: "Panel de control", icon: <BarChart3 size={18} />, category: "General" },
    { id: "ventas-facturacion", label: "Facturación", description: "Facturas de venta", icon: <FileText size={18} />, category: "Ventas" },
    { id: "ventas-clientes", label: "Clientes", description: "Gestión de clientes", icon: <Users size={18} />, category: "Ventas" },
    { id: "ventas-productos", label: "Productos De Venta", description: "Catálogo de productos", icon: <Package size={18} />, category: "Ventas" },
    { id: "ventas-vendedor", label: "Vendedores", description: "Gestión de vendedores", icon: <User size={18} />, category: "Ventas" },
    { id: "ventas-bodega", label: "Bodega", description: "Gestión de bodegas", icon: <Store size={18} />, category: "Ventas" },
    { id: "inventario-precios", label: "Lista De Precios", description: "Precios de inventario", icon: <Tag size={18} />, category: "Inventario" },
]

interface GlobalSearchProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (id: string) => void
}

export function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps) {
    const [query, setQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    const results = query.trim().length > 0
        ? SEARCHABLE_ITEMS.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )
        : []

    const hasResults = results.length > 0

    // Enfocar input al abrir
    useEffect(() => {
        if (isOpen) {
            setQuery("")
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 80)
        }
    }, [isOpen])

    // Navegación por teclado
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                onClose()
            } else if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex((prev) => Math.max(prev - 1, 0))
            } else if (e.key === "Enter" && results[selectedIndex]) {
                handleNavigate(results[selectedIndex].id)
            }
        },
        [results, selectedIndex, onClose]
    )

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    const handleNavigate = (id: string) => {
        onSelect(id)
        onClose()
        setQuery("")
    }

    if (!isOpen) return null

    // Agrupar resultados por categoría
    const grouped = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
    }, {})

    return (
        // Overlay con blur
        <div
            className="fixed inset-0 z-[999] flex flex-col items-center"
            style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                animation: "fadeIn 0.15s ease",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            {/* Contenedor que se mueve: centrado sin resultados, sube con resultados */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    padding: "0 1rem",
                    transition: "margin-top 0.35s cubic-bezier(0.4,0,0.2,1)",
                    marginTop: hasResults ? "80px" : "calc(50vh - 36px)",
                }}
            >
                {/* Input de búsqueda */}
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 shadow-2xl"
                    style={{
                        background: "rgba(30,30,40,0.92)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15)",
                    }}
                >
                    <Search size={20} className="text-purple-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar en Simplapp..."
                        className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-[15px]"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="text-white/30 hover:text-white/70 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-white/30 border border-white/10 font-mono">
                        ESC
                    </kbd>
                </div>

                {/* Panel de resultados con animación de aparición */}
                <div
                    style={{
                        maxHeight: hasResults ? "420px" : "0px",
                        opacity: hasResults ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                        marginTop: hasResults ? "10px" : "0px",
                    }}
                >
                    <div
                        className="rounded-2xl border border-white/10 overflow-hidden"
                        style={{
                            background: "rgba(22,22,32,0.96)",
                            boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
                        }}
                    >
                        {/* Contador de resultados */}
                        <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[11px] text-white/30 font-medium uppercase tracking-widest">
                                {results.length} resultado{results.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-[11px] text-white/20">
                                ↑↓ navegar · Enter seleccionar
                            </span>
                        </div>

                        <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
                            {Object.entries(grouped).map(([category, items]) => (
                                <div key={category}>
                                    {/* Separador de categoría */}
                                    <div className="px-4 pt-3 pb-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-purple-400/60">
                                            {category}
                                        </span>
                                    </div>

                                    {items.map((item) => {
                                        const globalIndex = results.indexOf(item)
                                        const isSelected = globalIndex === selectedIndex
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleNavigate(item.id)}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 transition-colors duration-100 text-left",
                                                    isSelected
                                                        ? "bg-purple-500/20"
                                                        : "hover:bg-white/5"
                                                )}
                                            >
                                                {/* Ícono */}
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors duration-100",
                                                        isSelected
                                                            ? "bg-purple-500/30 text-purple-300"
                                                            : "bg-white/5 text-white/40"
                                                    )}
                                                >
                                                    {item.icon}
                                                </div>

                                                {/* Etiquetas */}
                                                <div className="flex-1 min-w-0">
                                                    <div className={cn(
                                                        "text-[14px] font-medium transition-colors",
                                                        isSelected ? "text-white" : "text-white/70"
                                                    )}>
                                                        {/* Highlight de la coincidencia */}
                                                        {highlightMatch(item.label, query)}
                                                    </div>
                                                    <div className="text-[12px] text-white/30 truncate">
                                                        {item.description}
                                                    </div>
                                                </div>

                                                {/* Flecha indicadora */}
                                                <ArrowRight
                                                    size={14}
                                                    className={cn(
                                                        "flex-shrink-0 transition-all duration-100",
                                                        isSelected ? "text-purple-400 translate-x-0.5" : "text-transparent"
                                                    )}
                                                />
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mensaje cuando no hay resultados */}
                {query.trim().length > 0 && !hasResults && (
                    <div
                        className="mt-2.5 rounded-2xl border border-white/10 px-5 py-6 text-center"
                        style={{
                            background: "rgba(22,22,32,0.93)",
                            animation: "fadeIn 0.2s ease",
                        }}
                    >
                        <Search size={28} className="mx-auto mb-2 text-white/15" />
                        <p className="text-white/40 text-sm">Sin resultados para <span className="text-white/60">"{query}"</span></p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
        </div>
    )
}

/** Resalta la parte del texto que coincide con la búsqueda */
function highlightMatch(text: string, query: string) {
    if (!query) return <>{text}</>
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return <>{text}</>
    return (
        <>
            {text.slice(0, idx)}
            <span className="text-purple-300 font-semibold">{text.slice(idx, idx + query.length)}</span>
            {text.slice(idx + query.length)}
        </>
    )
}

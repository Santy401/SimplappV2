"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
    Search,
    X,
    Home,
    BarChart3,
    FileText,
    Users,
    Package,
    User,
    Store,
    Tag,
    ArrowRight,
    Loader2,
    Receipt
} from "lucide-react"
import { cn } from "../utils/utils"

interface SearchResult {
    id: string
    label: string
    description: string
    icon: React.ReactNode
    category: string
    backendType?: string
    backendId?: string
    raw?: unknown
}

// Catálogo de vistas navegables locales que se pueden buscar
const SEARCHABLE_ITEMS: SearchResult[] = [
    { id: "inicio", label: "Inicio", description: "Página principal", icon: <Home size={18} />, category: "Navegación" },
    { id: "dashboard", label: "Dashboard", description: "Panel de control", icon: <BarChart3 size={18} />, category: "Navegación" },
    { id: "ventas-facturacion", label: "Facturación", description: "Facturas de venta", icon: <FileText size={18} />, category: "Navegación" },
    { id: "ventas-clientes", label: "Clientes", description: "Gestión de clientes", icon: <Users size={18} />, category: "Navegación" },
    { id: "ventas-productos", label: "Productos De Venta", description: "Catálogo de productos", icon: <Package size={18} />, category: "Navegación" },
    { id: "ventas-vendedor", label: "Vendedores", description: "Gestión de vendedores", icon: <User size={18} />, category: "Navegación" },
    { id: "ventas-bodega", label: "Bodega", description: "Gestión de bodegas", icon: <Store size={18} />, category: "Navegación" },
    { id: "inventario-precios", label: "Lista De Precios", description: "Precios de inventario", icon: <Tag size={18} />, category: "Navegación" },
]

interface GlobalSearchProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (id: string, item?: SearchResult) => void
}

export function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [backendResults, setBackendResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Debounce para la búsqueda en BD
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(handler)
    }, [query])

    // Effect para buscar en BD remota
    useEffect(() => {
        if (debouncedQuery.trim().length === 0) {
            setBackendResults([])
            setIsSearching(false)
            return
        }

        let current = true
        const searchApi = async () => {
            setIsSearching(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
                if (!res.ok) throw new Error("Search failed")
                const data = await res.json()

                if (current) {
                    const mappedResults: SearchResult[] = data.results.map((r: { id: string, type: string, label: string, description: string, raw?: unknown }) => {
                        let icon = <FileText size={18} />
                        let category = "Datos"

                        if (r.type === 'client') {
                            icon = <Users size={18} />
                            category = "Clientes"
                        } else if (r.type === 'product') {
                            icon = <Package size={18} />
                            category = "Productos"
                        } else if (r.type === 'bill') {
                            icon = <Receipt size={18} />
                            category = "Facturas"
                        }

                        return {
                            id: `backend-${r.type}-${r.id}`,
                            label: r.label,
                            description: r.description,
                            icon,
                            category,
                            backendType: r.type,
                            backendId: r.id,
                            raw: r.raw
                        }
                    })
                    setBackendResults(mappedResults)
                }
            } catch (error) {
                console.error("API search error", error)
            } finally {
                if (current) setIsSearching(false)
            }
        }

        searchApi()

        return () => { current = false }
    }, [debouncedQuery])


    const localResults = query.trim().length > 0
        ? SEARCHABLE_ITEMS.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )
        : []

    const results = [...localResults, ...backendResults]
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
                handleNavigate(results[selectedIndex])
            }
        },
        [results, selectedIndex, onClose]
    )

    useEffect(() => {
        setSelectedIndex(0)
    }, [query, backendResults])

    const handleNavigate = (item: SearchResult) => {
        onSelect(item.id, item)
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
        // Overlay con blur suave
        <div
            className="fixed inset-0 z-[999] flex flex-col items-center"
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                animation: "fadeIn 0.15s ease",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            {/* Contenedor principal */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    padding: "0 1rem",
                    transition: "margin-top 0.35s cubic-bezier(0.4,0,0.2,1)",
                    marginTop: hasResults || isSearching ? "100px" : "calc(50vh - 36px)",
                }}
            >
                {/* Input de búsqueda */}
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-200/60 shadow-xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
                    }}
                >
                    {isSearching ? (
                        <Loader2 size={20} className="text-blue-500 flex-shrink-0 animate-spin" />
                    ) : (
                        <Search size={20} className="text-slate-400 flex-shrink-0" />
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar vistas, clientes, facturas o productos..."
                        className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-[15px]"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-200 bg-slate-50 font-mono">
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
                        className="rounded-2xl border border-slate-200/60 overflow-hidden bg-white"
                        style={{
                            boxShadow: "0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
                        }}
                    >
                        {/* Contador de resultados */}
                        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">
                                {results.length} resultado{results.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                ↑↓ navegar · Enter seleccionar
                            </span>
                        </div>

                        <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
                            {Object.entries(grouped).map(([category, items]) => (
                                <div key={category}>
                                    {/* Separador de categoría */}
                                    <div className="px-4 pt-3 pb-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500/80">
                                            {category}
                                        </span>
                                    </div>

                                    {items.map((item) => {
                                        const globalIndex = results.indexOf(item)
                                        const isSelected = globalIndex === selectedIndex
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleNavigate(item)}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 transition-colors duration-100 text-left",
                                                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                                                )}
                                            >
                                                {/* Ícono */}
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors duration-100",
                                                        isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                                    )}
                                                >
                                                    {item.icon}
                                                </div>

                                                {/* Etiquetas */}
                                                <div className="flex-1 min-w-0">
                                                    <div className={cn(
                                                        "text-[14px] font-medium transition-colors",
                                                        isSelected ? "text-blue-900" : "text-slate-700"
                                                    )}>
                                                        {highlightMatch(item.label, query)}
                                                    </div>
                                                    <div className="text-[12px] text-slate-500 truncate">
                                                        {item.description}
                                                    </div>
                                                </div>

                                                {/* Flecha indicadora */}
                                                <ArrowRight
                                                    size={14}
                                                    className={cn(
                                                        "flex-shrink-0 transition-all duration-100",
                                                        isSelected ? "text-blue-500 translate-x-0.5" : "text-transparent"
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

                {/* Mensaje cuando no hay resultados pero ya terminó de buscar */}
                {query.trim().length > 0 && !hasResults && !isSearching && (
                    <div
                        className="mt-2.5 rounded-2xl border border-slate-200 px-5 py-6 text-center shadow-lg bg-white"
                        style={{
                            animation: "fadeIn 0.2s ease",
                        }}
                    >
                        <Search size={28} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-slate-500 text-sm">Sin resultados para <span className="text-slate-700 font-medium">"{query}"</span></p>
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

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

interface NavbarDropdownSearchProps {
    onSelect?: (view: string) => void
    onOpenModal?: () => void
}

export function NavbarDropdownSearch({ onSelect, onOpenModal }: NavbarDropdownSearchProps) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [backendResults, setBackendResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Cierra el dropdown al hacer click afuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(handler)
    }, [query])

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
    const isOpen = isFocused && query.trim().length > 0

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                setIsFocused(false)
                e.currentTarget.blur()
            } else if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex((prev) => Math.max(prev - 1, 0))
            } else if (e.key === "Enter" && results[selectedIndex]) {
                handleNavigate(results[selectedIndex])
            } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenModal?.()
            }
        },
        [results, selectedIndex, onOpenModal]
    )

    useEffect(() => {
        setSelectedIndex(0)
    }, [query, backendResults])

    const handleNavigate = (item: SearchResult) => {
        if (onSelect) onSelect(item.id)
        setQuery("")
        setIsFocused(false)
    }

    const grouped = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
    }, {})

    return (
        <div ref={containerRef} className="w-full relative group z-50">
            <div className={`relative flex items-center transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500/20 rounded-xl' : ''}`}>
                {isSearching ? (
                    <Loader2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
                ) : (
                    <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
                )}

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar vistas, clientes, facturas o productos..."
                    className="w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/50 focus:border-blue-500 focus:bg-white rounded-xl text-sm text-slate-700 outline-none transition-all placeholder-slate-400 shadow-sm"
                />

                {query ? (
                    <button
                        onClick={() => { setQuery(""); setIsFocused(false) }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                    >
                        <X size={14} />
                    </button>
                ) : (
                    <button
                        onClick={onOpenModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-200 bg-white font-mono hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Abrir búsqueda avanzada"
                    >
                        <span className="text-[12px]">⌘</span>K
                    </button>
                )}
            </div>

            {/* Dropdown flotante */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {hasResults ? (
                        <div className="max-h-[360px] overflow-y-auto">
                            {Object.entries(grouped).map(([category, items]) => (
                                <div key={category}>
                                    <div className="px-3 pt-2 pb-1 bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-100">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600/70">
                                            {category}
                                        </span>
                                    </div>
                                    <div className="p-1">
                                        {items.map((item) => {
                                            const globalIndex = results.indexOf(item)
                                            const isSelected = globalIndex === selectedIndex
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleNavigate(item)}
                                                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                                                        isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-colors",
                                                        isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                                    )}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={cn(
                                                            "text-[13px] font-medium truncate",
                                                            isSelected ? "text-blue-900" : "text-slate-700"
                                                        )}>
                                                            {highlightMatch(item.label, query)}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 truncate">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isSearching && (
                            <div className="px-4 py-8 text-center bg-slate-50/50">
                                <Search size={24} className="mx-auto mb-2 text-slate-300" />
                                <p className="text-slate-500 text-sm">No hay resultados para <span className="font-medium">"{query}"</span></p>
                            </div>
                        )
                    )}
                </div>
            )}
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
            <span className="text-blue-600 font-semibold bg-blue-50 px-0.5 rounded-sm">{text.slice(idx, idx + query.length)}</span>
            {text.slice(idx + query.length)}
        </>
    )
}

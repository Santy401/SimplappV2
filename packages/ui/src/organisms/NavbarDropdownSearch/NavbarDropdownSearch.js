"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Home, BarChart3, FileText, Users, Package, User, Store, Tag, Loader2, Receipt } from "lucide-react";
import { cn } from "../../utils/utils";
// CatÃ¡logo de vistas navegables locales que se pueden buscar
const SEARCHABLE_ITEMS = [
    { id: "inicio", label: "Inicio", description: "PÃ¡gina principal", icon: _jsx(Home, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "dashboard", label: "Dashboard", description: "Panel de control", icon: _jsx(BarChart3, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "ventas-facturacion", label: "FacturaciÃ³n", description: "Facturas de venta", icon: _jsx(FileText, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "ventas-clientes", label: "Clientes", description: "GestiÃ³n de clientes", icon: _jsx(Users, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "ventas-productos", label: "Productos De Venta", description: "CatÃ¡logo de productos", icon: _jsx(Package, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "ventas-vendedor", label: "Vendedores", description: "GestiÃ³n de vendedores", icon: _jsx(User, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "ventas-bodega", label: "Bodega", description: "GestiÃ³n de bodegas", icon: _jsx(Store, { size: 18 }), category: "NavegaciÃ³n" },
    { id: "inventario-precios", label: "Lista De Precios", description: "Precios de inventario", icon: _jsx(Tag, { size: 18 }), category: "NavegaciÃ³n" },
];
export function NavbarDropdownSearch({ onSelect, onOpenModal }) {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [backendResults, setBackendResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    // Cierra el dropdown al hacer click afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(handler);
    }, [query]);
    useEffect(() => {
        if (debouncedQuery.trim().length === 0) {
            setBackendResults([]);
            setIsSearching(false);
            return;
        }
        let current = true;
        const searchApi = async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                if (!res.ok)
                    throw new Error("Search failed");
                const data = await res.json();
                if (current) {
                    const mappedResults = data.results.map((r) => {
                        let icon = _jsx(FileText, { size: 18 });
                        let category = "Datos";
                        if (r.type === 'client') {
                            icon = _jsx(Users, { size: 18 });
                            category = "Clientes";
                        }
                        else if (r.type === 'product') {
                            icon = _jsx(Package, { size: 18 });
                            category = "Productos";
                        }
                        else if (r.type === 'bill') {
                            icon = _jsx(Receipt, { size: 18 });
                            category = "Facturas";
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
                        };
                    });
                    setBackendResults(mappedResults);
                }
            }
            catch (error) {
                console.error("API search error", error);
            }
            finally {
                if (current)
                    setIsSearching(false);
            }
        };
        searchApi();
        return () => { current = false; };
    }, [debouncedQuery]);
    const localResults = query.trim().length > 0
        ? SEARCHABLE_ITEMS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()))
        : [];
    const results = [...localResults, ...backendResults];
    const hasResults = results.length > 0;
    const isOpen = isFocused && query.trim().length > 0;
    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            setIsFocused(false);
            e.currentTarget.blur();
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        }
        else if (e.key === "Enter" && results[selectedIndex]) {
            handleNavigate(results[selectedIndex]);
        }
        else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onOpenModal?.();
        }
    }, [results, selectedIndex, onOpenModal]);
    useEffect(() => {
        setSelectedIndex(0);
    }, [query, backendResults]);
    const handleNavigate = (item) => {
        if (onSelect)
            onSelect(item.id);
        setQuery("");
        setIsFocused(false);
    };
    const grouped = results.reduce((acc, item) => {
        if (!acc[item.category])
            acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});
    return (_jsxs("div", { ref: containerRef, className: "w-full relative group z-50", children: [_jsxs("div", { className: `relative flex items-center transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500/20 rounded-xl' : ''}`, children: [isSearching ? (_jsx(Loader2, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" })) : (_jsx(Search, { size: 16, className: `absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}` })), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onFocus: () => setIsFocused(true), onKeyDown: handleKeyDown, placeholder: "Buscar vistas, clientes, facturas o productos...", className: "w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/50 focus:border-blue-500 focus:bg-white rounded-xl text-sm text-slate-700 outline-none transition-all placeholder-slate-400 shadow-sm" }), query ? (_jsx("button", { onClick: () => { setQuery(""); setIsFocused(false); }, className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100", children: _jsx(X, { size: 14 }) })) : (_jsxs("button", { onClick: onOpenModal, className: "absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-200 bg-white font-mono hover:bg-slate-50 transition-colors cursor-pointer", title: "Abrir b\u00C3\u00BAsqueda avanzada", children: [_jsx("span", { className: "text-[12px]", children: "\u00E2\u0152\u02DC" }), "K"] }))] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200", children: hasResults ? (_jsx("div", { className: "max-h-[360px] overflow-y-auto", children: Object.entries(grouped).map(([category, items]) => (_jsxs("div", { children: [_jsx("div", { className: "px-3 pt-2 pb-1 bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-100", children: _jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-blue-600/70", children: category }) }), _jsx("div", { className: "p-1", children: items.map((item) => {
                                    const globalIndex = results.indexOf(item);
                                    const isSelected = globalIndex === selectedIndex;
                                    return (_jsxs("button", { onClick: () => handleNavigate(item), onMouseEnter: () => setSelectedIndex(globalIndex), className: cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left", isSelected ? "bg-blue-50" : "hover:bg-slate-50"), children: [_jsx("div", { className: cn("flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-colors", isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"), children: item.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: cn("text-[13px] font-medium truncate", isSelected ? "text-blue-900" : "text-slate-700"), children: highlightMatch(item.label, query) }), _jsx("div", { className: "text-[11px] text-slate-500 truncate", children: item.description })] })] }, item.id));
                                }) })] }, category))) })) : (!isSearching && (_jsxs("div", { className: "px-4 py-8 text-center bg-slate-50/50", children: [_jsx(Search, { size: 24, className: "mx-auto mb-2 text-slate-300" }), _jsxs("p", { className: "text-slate-500 text-sm", children: ["No hay resultados para ", _jsxs("span", { className: "font-medium", children: ["\"", query, "\""] })] })] }))) }))] }));
}
function highlightMatch(text, query) {
    if (!query)
        return _jsx(_Fragment, { children: text });
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1)
        return _jsx(_Fragment, { children: text });
    return (_jsxs(_Fragment, { children: [text.slice(0, idx), _jsx("span", { className: "text-blue-600 font-semibold bg-blue-50 px-0.5 rounded-sm", children: text.slice(idx, idx + query.length) }), text.slice(idx + query.length)] }));
}

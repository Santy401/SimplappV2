"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search, Loader2, Trash2, } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
export function ModernTable({ data, columns, title = "", description, onAdd, onView, onExport, onDeleteMany, addActionLabel = "Nuevo", isLoading = false, emptyStateMessage = "No hay registros disponibles.", searchable = true, pagination = true, itemsPerPage: initialItemsPerPage = 10, }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    // Selection State
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    // Normalize isLoading
    const isDataLoading = typeof isLoading === 'object' ? isLoading.fetch : isLoading;
    const filteredData = useMemo(() => {
        const processedData = data;
        if (!searchQuery)
            return processedData;
        const searchLower = searchQuery.toLowerCase();
        return processedData.filter((item) => columns.some((column) => {
            const value = item[column.key];
            if (value === null || value === undefined)
                return false;
            let searchableValue = "";
            if (typeof value === "string") {
                searchableValue = value;
            }
            else if (typeof value === "number" || typeof value === "boolean") {
                searchableValue = String(value);
            }
            else if (typeof value === "object") {
                searchableValue = JSON.stringify(value);
            }
            return searchableValue.toLowerCase().includes(searchLower);
        }));
    }, [data, searchQuery, columns]);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = pagination
        ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : filteredData;
    const handlePageChange = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
    // --- Multi-select logic ---
    const allCurrentPageSelected = useMemo(() => {
        if (paginatedData.length === 0)
            return false;
        return paginatedData.every((item) => selectedIds.has(item.id));
    }, [paginatedData, selectedIds]);
    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allCurrentPageSelected) {
                paginatedData.forEach((item) => next.delete(item.id));
            }
            else {
                paginatedData.forEach((item) => next.add(item.id));
            }
            return next;
        });
    };
    const toggleSelectItem = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const handleBulkDelete = async () => {
        if (!onDeleteMany || selectedIds.size === 0)
            return;
        const selectedItems = data.filter((item) => selectedIds.has(item.id));
        if (selectedItems.length === 0)
            return;
        if (!confirm(`¿Estás seguro de eliminar ${selectedItems.length} elemento(s)?`))
            return;
        setIsBulkDeleting(true);
        try {
            await onDeleteMany(selectedItems);
            setSelectedIds(new Set());
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsBulkDeleting(false);
        }
    };
    const renderCell = (item, column) => {
        if (column.cell) {
            return column.cell(item);
        }
        const value = item[column.key];
        return _jsx(_Fragment, { children: value });
    };
    return (_jsxs("div", { className: "flex-1 w-full overflow-y-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight dark:text-white", children: title }), description && (_jsx("p", { className: "text-slate-500 mt-2", children: description }))] }), onAdd && (_jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs(Button, { variant: "WithIcon", onClick: onAdd, children: [_jsx(Plus, { className: "w-4 h-4" }), addActionLabel] }) }))] }), _jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative", children: [isBulkDeleting && (_jsx("div", { className: "absolute inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center", children: _jsxs("div", { className: "flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-brand" }), _jsx("p", { className: "text-sm text-foreground font-medium", children: "Procesando..." })] }) })), selectedIds.size > 0 && (_jsxs("div", { className: "absolute top-0 left-0 right-0 h-[73px] bg-white dark:bg-brand/10 border-b border-brand/20 dark:border-brand/20 flex items-center justify-between px-4 z-40 animate-in fade-in slide-in-from-top-2", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("span", { className: "font-medium text-brand", children: [selectedIds.size, " elemento(s) seleccionado(s)"] }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setSelectedIds(new Set()), className: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors", children: "Cancelar" }), onDeleteMany && (_jsxs(Button, { variant: "destructive", onClick: handleBulkDelete, className: "bg-red-500 hover:bg-red-600 rounded p-2 flex items-center text-white border-0 shadow-sm", children: ["Borrar seleccionados", _jsx(Trash2, { className: "w-4 h-4 ml-2" })] }))] })] })), _jsx("div", { className: "p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between", children: searchable && (_jsxs("div", { className: "relative w-full sm:w-72", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "text", placeholder: "Buscar...", value: searchQuery, onChange: (e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }, className: "w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all" })] })) }), _jsx("div", { className: "overflow-x-auto min-h-[300px]", children: _jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [_jsx("thead", { className: "bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-200 dark:border-slate-800", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 font-medium w-10", children: _jsx("input", { type: "checkbox", checked: paginatedData.length > 0 && allCurrentPageSelected, onChange: toggleSelectAll, className: "rounded border-slate-300 dark:border-slate-700 text-brand focus:ring-brand bg-white dark:bg-slate-900 cursor-pointer" }) }), columns.map((col) => (_jsx("th", { className: `p-4 font-medium text-slate-500 dark:text-slate-400 ${col.className || ""}`, children: col.header }, String(col.key)))), _jsx("th", { className: "w-10" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: isDataLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + 2, className: "p-12", children: _jsxs("div", { className: "flex flex-col items-center justify-center text-slate-400", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin mb-4 text-brand" }), _jsx("p", { children: "Cargando datos..." })] }) }) })) : filteredData.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + 2, className: "p-8", children: _jsx("div", { className: "flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-10 text-slate-500", children: _jsx("p", { children: emptyStateMessage }) }) }) })) : (paginatedData.map((item) => {
                                        const isSelected = selectedIds.has(item.id);
                                        return (_jsxs("tr", { onClick: () => onView && onView(item), className: `transition-colors ${onView ? 'cursor-pointer' : ''} ${isSelected ? 'bg-brand/5 dark:bg-brand/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`, children: [_jsx("td", { className: "p-4", onClick: (e) => e.stopPropagation(), children: _jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelectItem(item.id), className: "rounded border-slate-300 dark:border-slate-700 text-brand focus:ring-brand bg-white dark:bg-slate-900 cursor-pointer" }) }), columns.map((col) => (_jsx("td", { className: `p-4 text-slate-700 dark:text-slate-300 ${col.className || ""}`, children: renderCell(item, col) }, String(col.key))))] }, item.id));
                                    })) })] }) }), pagination && filteredData.length > 0 && (_jsxs("div", { className: "p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/30", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { children: "Mostrar" }), _jsxs("select", { value: itemsPerPage, onChange: (e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }, className: "px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand transition-colors", children: [_jsx("option", { value: 5, children: "5" }), _jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 20, children: "20" }), _jsx("option", { value: 50, children: "50" })] }), _jsx("span", { children: "registros" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-slate-500", children: ["Mostrando ", startIndex, " - ", endIndex, " de ", filteredData.length] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(1), disabled: currentPage === 1, className: "w-8 h-8 p-0 disabled:opacity-50", children: _jsx(ChevronsLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: "w-8 h-8 p-0 disabled:opacity-50", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-center gap-1 mx-1", children: [_jsx("span", { className: "w-8 text-center font-medium text-slate-700 dark:text-slate-200", children: currentPage }), _jsx("span", { className: "text-slate-400", children: "/" }), _jsx("span", { className: "w-8 text-center text-slate-500", children: totalPages })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: "w-8 h-8 p-0 disabled:opacity-50", children: _jsx(ChevronRight, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(totalPages), disabled: currentPage === totalPages, className: "w-8 h-8 p-0 disabled:opacity-50", children: _jsx(ChevronsRight, { className: "w-4 h-4" }) })] })] })] }))] })] }));
}

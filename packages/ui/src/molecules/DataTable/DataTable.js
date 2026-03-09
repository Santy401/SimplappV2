"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, X, Loader2, } from "lucide-react";
import { Button } from '../../atoms/Button/Button';
;
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
export function DataTable({ data, columns, title: _title = "Data Table", searchable: _searchable = true, pagination = true, itemsPerPage: initialItemsPerPage = 10, onEdit: _onEdit, onDelete: _onDelete, onDeleteMany, onView, onAdd: _onAdd, onExport: _onExport, actions: _actions, className = "", isBillView, isLoading, }) {
    const [searchQuery, _setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const [statusFilter, _setStatusFilter] = useState("all");
    // Multi-select state
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [lastClickedId, setLastClickedId] = useState(null);
    const filteredData = useMemo(() => {
        let processedData = data;
        if (isBillView && statusFilter !== 'all') {
            processedData = processedData.filter((item) => {
                const status = item.status;
                const dueDate = item.dueDate ? new Date(item.dueDate) : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                switch (statusFilter) {
                    case 'active':
                        return ['ISSUED', 'TO_PAY', 'PARTIALLY_PAID'].includes(status);
                    case 'pay':
                        return status === 'PAID';
                    case 'overdue':
                        if (!dueDate)
                            return false;
                        return dueDate < today && status !== 'PAID' && status !== 'CANCELLED' && status !== 'DRAFT';
                    case 'draft':
                        return status === 'DRAFT';
                    default:
                        return true;
                }
            });
        }
        if (!searchQuery)
            return processedData;
        const searchLower = searchQuery.toLowerCase();
        return processedData.filter((item) => columns.some((column) => {
            const value = item[column.key];
            if (value === null || value === undefined)
                return false;
            let searchableValue = '';
            if (typeof value === 'string') {
                searchableValue = value;
            }
            else if (typeof value === 'number' || typeof value === 'boolean') {
                searchableValue = String(value);
            }
            else if (typeof value === 'object') {
                searchableValue = JSON.stringify(value);
            }
            return searchableValue.toLowerCase().includes(searchLower);
        }));
    }, [data, searchQuery, columns, isBillView, statusFilter]);
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
    const hasSelection = selectedIds.size > 0;
    const allCurrentPageSelected = useMemo(() => {
        if (paginatedData.length === 0)
            return false;
        return paginatedData.every((item) => selectedIds.has(item.id));
    }, [paginatedData, selectedIds]);
    const someCurrentPageSelected = useMemo(() => {
        if (paginatedData.length === 0)
            return false;
        const someSelected = paginatedData.some((item) => selectedIds.has(item.id));
        return someSelected && !allCurrentPageSelected;
    }, [paginatedData, selectedIds, allCurrentPageSelected]);
    const toggleSelectAll = useCallback(() => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allCurrentPageSelected) {
                // Deselect all on current page
                paginatedData.forEach((item) => next.delete(item.id));
            }
            else {
                // Select all on current page
                paginatedData.forEach((item) => next.add(item.id));
            }
            return next;
        });
    }, [paginatedData, allCurrentPageSelected]);
    const toggleSelectItem = useCallback((id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    }, []);
    const handleRowClick = useCallback((item, e) => {
        e.stopPropagation();
        // Si hay onView (por ejemplo en facturas), abrimos la vista inmediatamente con un solo click
        if (onView) {
            onView(item);
            return;
        }
        // Comportamiento original para otras tablas (doble click para seleccionar)
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }
        if (lastClickedId === item.id) {
            // DOBLE CLICK - Seleccionar/deseleccionar
            toggleSelectItem(item.id);
            setLastClickedId(null); // Resetear para el próximo ciclo
        }
        else {
            // PRIMER CLICK - Guardar el ID y esperar
            setLastClickedId(item.id);
            // Configurar timeout para resetear después de 300ms
            const timeout = setTimeout(() => {
                setLastClickedId(null);
            }, 300);
            setClickTimeout(timeout);
        }
    }, [clickTimeout, lastClickedId, toggleSelectItem, onView]);
    // Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
        };
    }, [clickTimeout]);
    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);
    const handleBulkDelete = useCallback(async () => {
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
            clearSelection();
        }
        catch (error) {
            console.error('Error deleting items:', error);
        }
        finally {
            setIsBulkDeleting(false);
        }
    }, [onDeleteMany, selectedIds, data, clearSelection]);
    const renderCell = (item, column) => {
        if (column.cell) {
            return column.cell(item);
        }
        const value = item[column.key];
        return _jsx(_Fragment, { children: value });
    };
    return (_jsxs("div", { className: `rounded-lg bg-white border border-sidebar-border mt-5 ${className} relative`, children: [isBulkDeleting && (_jsx("div", { className: "fixed inset-0 top-0 left-0 w-screen h-screen bg-background/80 backdrop-blur-md z-[9999] flex items-center justify-center", children: _jsxs("div", { className: "flex flex-col items-center gap-3 p-6 bg-card border border-sidebar-border rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300", children: [_jsx(Loader2, { className: "w-10 h-10 animate-spin text-primary" }), _jsxs("p", { className: "text-lg text-foreground font-medium", children: ["Eliminando ", selectedIds.size, " elemento(s)..."] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Por favor espera, no cierres esta ventana." })] }) })), _jsxs("div", { className: "mb-4", children: [hasSelection && (_jsxs("div", { className: "flex items-center justify-between gap-4 px-4 py-3  border border-primary/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-sm font-medium text-foreground", children: [selectedIds.size, " seleccionado"] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: clearSelection, className: "gap-1 h-7 text-xs flex items-center text-muted-foreground hover:text-foreground", children: [_jsx(X, { className: "w-3 h-3" }), "Deseleccionar"] })] }), _jsx("div", { className: "flex items-center gap-2", children: onDeleteMany && (_jsxs(Button, { variant: "destructive", size: "sm", onClick: handleBulkDelete, disabled: isBulkDeleting, children: ["Eliminar", isBulkDeleting ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Trash2, { className: "w-4 h-4" }))] })) })] })), _jsx("div", { className: "w-full bg-white rounded-lg h-[calc(100vh-200px)] overflow-x-auto", children: _jsxs("table", { className: "w-full overflow-auto", children: [_jsx("thead", { className: "border-b border border-sidebar-border", children: _jsxs("tr", { children: [_jsx("th", { className: "w-10 px-4 py-3 text-left", children: _jsx(Checkbox, { checked: allCurrentPageSelected ? true : someCurrentPageSelected ? "indeterminate" : false, onCheckedChange: toggleSelectAll }) }), columns.map((column) => (_jsx("th", { className: `px-4 py-3 text-left text-[13px] font-medium text-muted-foreground ${column.className || ""}`, children: column.header }, String(column.key))))] }) }), _jsx("tbody", { className: "divide-y divide-sidebar-border", children: paginatedData.map((item) => {
                                        const isSelected = selectedIds.has(item.id);
                                        return (_jsxs("tr", { className: `
          transition-all duration-300 border-b border-sidebar-border cursor-pointer
          ${isSelected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-gray-400/15"}
          ${isLoading?.deleteId === item.id ? 'opacity-50 pointer-events-none' : ''}
        `, onClick: (e) => handleRowClick(item, e), children: [_jsx("td", { className: "w-10 px-4 py-4", onClick: (e) => e.stopPropagation(), children: _jsx(Checkbox, { checked: isSelected, onCheckedChange: () => toggleSelectItem(item.id) }) }), columns.map((column) => (_jsx("td", { className: `px-4 py-1 ${column.className || ""}`, children: renderCell(item, column) }, String(column.key))))] }, item.id));
                                    }) })] }) }), pagination && filteredData.length > 0 && (_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mx-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Rows per page" }), _jsxs("select", { value: itemsPerPage, onChange: (e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }, className: "px-2 py-1 bg-card border border-[#2d2d2d] rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring", children: [_jsx("option", { value: 9, children: "10" }), _jsx("option", { value: 30, children: "30" }), _jsx("option", { value: 50, children: "50" })] }), _jsxs("span", { className: "text-sm text-muted-foreground", children: [startIndex, "-", endIndex, " of ", filteredData.length, " rows"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(1), disabled: currentPage === 1, children: _jsx(ChevronsLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex gap-1", children: [Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                }
                                                else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                }
                                                else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                }
                                                else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                if (i === 0 && pageNum > 1) {
                                                    return (_jsx("div", { className: "px-2 py-1 text-muted-foreground", children: "..." }, "dots-start"));
                                                }
                                                return (_jsx(Button, { variant: currentPage === pageNum ? "default" : "outline", size: "sm", onClick: () => handlePageChange(pageNum), className: "min-w-8", children: pageNum }, pageNum));
                                            }), totalPages > 5 && _jsx("div", { className: "px-2 py-1 text-muted-foreground", children: "..." })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, children: _jsx(ChevronRight, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(totalPages), disabled: currentPage === totalPages, children: _jsx(ChevronsRight, { className: "w-4 h-4" }) })] })] }))] })] }));
}

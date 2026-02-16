"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Trash2,
  Eye,
  Settings,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from '../atoms/Button/Button';;
import { Checkbox } from "../atoms/Checkbox/Checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../molecules/Tabs";
import { TableColumn, TableProps } from "../types/table.entity";

export function DataTable<T extends { id: string | string }>({
  data,
  columns,
  title = "Data Table",
  searchable = true,
  pagination = true,
  itemsPerPage: initialItemsPerPage = 10,
  onEdit,
  onDelete,
  onDeleteMany,
  onView,
  onAdd,
  onExport,
  actions,
  className = "",
  isBillView,
  isLoading,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [statusFilter, setStatusFilter] = useState("all");

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Animation states
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [fadingOutIds, setFadingOutIds] = useState<Set<string>>(new Set());

  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    let processedData = data;

    if (isBillView && statusFilter !== 'all') {
      processedData = processedData.filter((item: any) => {
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
            if (!dueDate) return false;
            return dueDate < today && status !== 'PAID' && status !== 'CANCELLED' && status !== 'DRAFT';
          case 'draft':
            return status === 'DRAFT';
          default:
            return true;
        }
      });
    }

    if (!searchQuery) return processedData;

    const searchLower = searchQuery.toLowerCase();

    return processedData.filter((item) =>
      columns.some((column) => {
        const value = item[column.key as keyof T];

        if (value === null || value === undefined) return false;

        let searchableValue = '';

        if (typeof value === 'string') {
          searchableValue = value;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          searchableValue = String(value);
        } else if (typeof value === 'object') {
          searchableValue = JSON.stringify(value);
        }

        return searchableValue.toLowerCase().includes(searchLower);
      })
    );
  }, [data, searchQuery, columns, isBillView, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

  // --- Multi-select logic ---
  const hasSelection = selectedIds.size > 0;

  const allCurrentPageSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every((item) => selectedIds.has(item.id));
  }, [paginatedData, selectedIds]);

  const someCurrentPageSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    const someSelected = paginatedData.some((item) => selectedIds.has(item.id));
    return someSelected && !allCurrentPageSelected;
  }, [paginatedData, selectedIds, allCurrentPageSelected]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allCurrentPageSelected) {
        // Deselect all on current page
        paginatedData.forEach((item) => next.delete(item.id));
      } else {
        // Select all on current page
        paginatedData.forEach((item) => next.add(item.id));
      }
      return next;
    });
  }, [paginatedData, allCurrentPageSelected]);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleRowClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Si hay un timeout previo, lo limpiamos
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }

    // Si el click es en la misma fila que el anterior, es un doble click
    if (lastClickedId === id) {
      // DOBLE CLICK - Seleccionar/deseleccionar
      toggleSelectItem(id);
      setLastClickedId(null); // Resetear para el próximo ciclo
    } else {
      // PRIMER CLICK - Guardar el ID y esperar
      setLastClickedId(id);

      // Configurar timeout para resetear después de 300ms
      const timeout = setTimeout(() => {
        setLastClickedId(null);
      }, 300);

      setClickTimeout(timeout);
    }
  }, [clickTimeout, lastClickedId, toggleSelectItem]);

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
    if (!onDeleteMany || selectedIds.size === 0) return;

    const selectedItems = data.filter((item) => selectedIds.has(item.id));
    if (selectedItems.length === 0) return;

    if (!confirm(`¿Estás seguro de eliminar ${selectedItems.length} elemento(s)?`)) return;

    // Marcar como eliminando
    setDeletingIds(new Set(selectedIds));
    setIsBulkDeleting(true);

    // Iniciar animación de fade-out
    setFadingOutIds(new Set(selectedIds));

    try {
      // Esperar la animación antes de eliminar
      await new Promise(resolve => setTimeout(resolve, 400));

      await onDeleteMany(selectedItems);
      clearSelection();
      setDeletingIds(new Set());
      setFadingOutIds(new Set());
    } catch (error) {
      console.error('Error deleting items:', error);
      setDeletingIds(new Set());
      setFadingOutIds(new Set());
    } finally {
      setIsBulkDeleting(false);
    }
  }, [onDeleteMany, selectedIds, data, clearSelection]);

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.cell) {
      return column.cell(item);
    }

    const value = item[column.key as keyof T];
    return <>{value}</>;
  };

  return (
    <div className={`rounded-lg ${className} relative`}>
      {/* Bulk loading overlay */}
      {isBulkDeleting && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3 p-6 bg-card border border-sidebar-border rounded-xl shadow-lg animate-in zoom-in-95 duration-300">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-foreground font-medium">Eliminando {selectedIds.size} elemento(s)...</p>
            <p className="text-xs text-muted-foreground">Por favor espera...</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white ml-4 mb-4">{title}</h1>
        <div className="flex flex-col gap-4 mx-1 my-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 items-center">
            <div className="flex gap-5">
              {actions || (
                <>
                  <div className="flex gap-2 border border-sidebar-border rounded-lg p-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Table
                    </Button>
                  </div>
                  <div>
                  </div>
                </>
              )}
              {/* Only show bill view tabs when there is NO selection */}
              {isBillView && !hasSelection && (
                <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="active">Por Pagar</TabsTrigger>
                    <TabsTrigger value="pay">Pagadas</TabsTrigger>
                    <TabsTrigger value="overdue">Vencidas</TabsTrigger>
                    <TabsTrigger value="draft">Borradores</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
            <div className="flex gap-2 flex-wrap md:flex-nowrap items-center">
              {searchable && (
                <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-sidebar-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selection action bar */}
        {hasSelection && (
          <div className="flex items-center justify-between gap-4 mx-1 my-3 px-4 py-3 bg-primary/10 border border-primary/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {selectedIds.size} seleccionado{selectedIds.size > 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={isBulkDeleting}
                className="gap-1 h-7 text-xs flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="w-3 h-3" />
                Deseleccionar
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {onDeleteMany && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="gap-2 h-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Eliminar ({selectedIds.size})
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="border border-sidebar-border scale-99 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-sidebar-border bg-card/50">
              <tr>
                <th className="w-10 px-4 py-4 text-left">
                  <Checkbox
                    checked={allCurrentPageSelected ? true : someCurrentPageSelected ? "indeterminate" : false}
                    onCheckedChange={toggleSelectAll}
                    disabled={isBulkDeleting}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-4 text-left text-sm font-medium text-muted-foreground ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sidebar-border">
              {paginatedData.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const isDeleting = deletingIds.has(item.id);
                const isFadingOut = fadingOutIds.has(item.id);
                const isSingleDeleting = isLoading?.deleteId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`
                      transition-all duration-400 cursor-pointer relative
                      ${isSelected && !isDeleting && !isSingleDeleting ? "bg-primary/10 hover:bg-primary/15" : ""}
                      ${!isSelected && !isDeleting && !isSingleDeleting ? "hover:bg-gray-400/15" : ""}
                      ${(isDeleting || isSingleDeleting) ? 'bg-red-500/20 hover:bg-red-500/25' : ''}
                      ${isFadingOut ? 'animate-out fade-out slide-out-to-right-2 duration-400' : 'animate-in fade-in duration-200'}
                      ${(isDeleting || isSingleDeleting) ? 'pointer-events-none' : ''}
                    `}
                    onClick={(e) => !isDeleting && !isSingleDeleting && handleRowClick(item.id, e)}
                  >
                    <td className="w-10 px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {(isDeleting || isSingleDeleting) ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            disabled={isBulkDeleting}
                          />
                        )}
                      </div>
                    </td>
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-1 ${column.className || ""} ${(isDeleting || isSingleDeleting) ? 'text-muted-foreground' : ''}`}
                      >
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination && filteredData.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mx-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-card border border-[#2d2d2d] rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value={9}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">
                {startIndex}-{endIndex} of {filteredData.length} rows
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (i === 0 && pageNum > 1) {
                    return (
                      <div key="dots-start" className="px-2 py-1 text-muted-foreground">
                        ...
                      </div>
                    );
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="min-w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && <div className="px-2 py-1 text-muted-foreground">...</div>}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
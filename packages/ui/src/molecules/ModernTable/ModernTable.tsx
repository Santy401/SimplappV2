"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
  Loader2,
  Trash2,
  LucideIcon,
  Database,
} from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { TableColumn, TableProps } from "../../types/table.entity";
import { cn } from "../../utils/utils";

export interface ModernTableProps<T> extends Omit<TableProps<T>, 'isLoading' | 'title'> {
  title?: string;
  description?: React.ReactNode;
  addActionLabel?: string;
  isLoading?: boolean | TableProps<T>['isLoading'];
  
  // Empty State Props
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function ModernTable<T extends { id: string }>({
  data,
  columns,
  title = "",
  description,
  onAdd,
  onView,
  onDeleteMany,
  addActionLabel = "Nuevo",
  isLoading = false,
  searchable = true,
  pagination = true,
  itemsPerPage: initialItemsPerPage = 10,
  emptyIcon: EmptyIcon = Database,
  emptyTitle = "No hay registros",
  emptyDescription = "Aún no se ha creado ningún registro en esta sección.",
  emptyActionLabel,
  onEmptyAction,
}: ModernTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Normalize isLoading
  const isDataLoading = typeof isLoading === 'object' ? isLoading.fetch : isLoading;

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const searchLower = searchQuery.toLowerCase();
    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.key as keyof T];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      })
    );
  }, [data, searchQuery, columns]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

  const allCurrentPageSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every((item: T) => selectedIds.has(item.id));
  }, [paginatedData, selectedIds]);

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allCurrentPageSelected) {
        paginatedData.forEach((item: T) => next.delete(item.id));
      } else {
        paginatedData.forEach((item: T) => next.add(item.id));
      }
      return next;
    });
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (!onDeleteMany || selectedIds.size === 0) return;
    const selectedItems = data.filter((item: T) => selectedIds.has(item.id));
    if (!confirm(`¿Estás seguro de eliminar ${selectedItems.length} elemento(s)?`)) return;

    setIsBulkDeleting(true);
    try {
      await onDeleteMany(selectedItems);
      setSelectedIds(new Set());
    } catch (error) {
      console.error(error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.cell) return column.cell(item);
    const value = item[column.key as keyof T];
    return <>{value as React.ReactNode}</>;
  };

  return (
    <div className="flex-1 w-full overflow-y-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-slate-500 mt-2">{description}</p>
          )}
        </div>   
        {onAdd && data.length > 0 && (
          <div className="mt-4 sm:mt-0">
            <Button variant="WithIcon" onClick={onAdd}>
              <Plus className="w-4 h-4" />
              {addActionLabel}
            </Button>
          </div>
        )} 
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Bulk Delete Overlay */}
        {isBulkDeleting && (
          <div className="absolute inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
             <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
               <Loader2 className="w-8 h-8 animate-spin text-[#6C47FF]" />
               <p className="text-sm text-foreground font-medium">Procesando...</p>
             </div>
          </div>
        )}

        {/* Floating Selection Toolbar */}
        {selectedIds.size > 0 && (
          <div className="absolute top-0 left-0 right-0 h-[73px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#6C47FF]">
                {selectedIds.size} seleccionado(s)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              {onDeleteMany && (
                <Button variant="destructive" onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-600 h-9 px-4 text-white">
                  Eliminar
                  <Trash2 className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
          {searchable && (
            <div className="relative w-full sm:w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                 type="text"
                 placeholder="Buscar..."
                 value={searchQuery}
                 onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                 }}
                 className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/20 focus:border-[#6C47FF] transition-all"
               />
            </div>
          )}
        </div>
        
        {/* Table wrapper */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-medium w-10 text-center">
                  <input 
                     type="checkbox" 
                     checked={paginatedData.length > 0 && allCurrentPageSelected}
                     onChange={toggleSelectAll}
                     className="rounded border-slate-300 dark:border-slate-700 text-[#6C47FF] focus:ring-[#6C47FF] bg-white dark:bg-slate-900 cursor-pointer" 
                  />
                </th>
                {columns.map((col) => (
                  <th key={String(col.key)} className={`p-4 font-medium text-slate-500 dark:text-slate-400 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isDataLoading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="p-12">
                     <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#6C47FF]" />
                        <p className="font-medium">Cargando datos...</p>
                     </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="p-0">
                     <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                           <EmptyIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
                           {emptyTitle}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed mb-8">
                           {emptyDescription}
                        </p>
                        {(onEmptyAction || onAdd) && (
                           <Button 
                              variant="default" 
                              onClick={onEmptyAction || onAdd}
                              className="bg-[#6C47FF] hover:bg-[#5835E8] text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
                           >
                              <Plus className="w-4 h-4" />
                              {emptyActionLabel || addActionLabel}
                           </Button>
                        )}
                     </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <tr 
                       key={item.id} 
                       onClick={() => onView && onView(item)}
                       className={cn(
                         "transition-colors group",
                         onView && "cursor-pointer",
                         isSelected ? "bg-purple-50/30 dark:bg-purple-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                       )}
                    >
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                           type="checkbox" 
                           checked={isSelected}
                           onChange={() => toggleSelectItem(item.id)}
                           className="rounded border-slate-300 dark:border-slate-700 text-[#6C47FF] focus:ring-[#6C47FF] bg-white dark:bg-slate-900 cursor-pointer" 
                        />
                      </td>
                      {columns.map((col) => (
                        <td key={String(col.key)} className={`p-4 text-slate-700 dark:text-slate-300 font-medium ${col.className || ""}`}>
                         {renderCell(item, col)}
                      </td>
                    ))}
                      <td className="p-4"></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && filteredData.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="flex items-center gap-3">
              <span>Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#6C47FF] transition-colors"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>registros</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">
                {startIndex} - {endIndex} de {filteredData.length}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 p-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  <span className="text-slate-900 dark:text-white font-bold">{currentPage}</span>
                  <span className="text-slate-400">/</span>
                  <span>{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 p-0"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

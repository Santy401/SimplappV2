"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/app/ui/cn/components/ui/button";
import { Checkbox } from "@/app/ui/cn/components/ui/checkbox";
import { TableColumn, TableProps } from "@/domain/entities/table.entity";

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  title = "Data Table",
  searchable = true,
  pagination = true,
  itemsPerPage: initialItemsPerPage = 10,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onExport,
  actions,
  className = "",
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.key as keyof T];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
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

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.cell) {
      return column.cell(item);
    }

    const value = item[column.key as keyof T];
    return <>{value}</>;
  };

  return (
    <div className={`rounded-lg ${className}`}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white ml-4 mb-4">{title}</h1>
        {/* <div className="flex flex-col gap-4 mb-3 scale-95">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 items-center">
            {actions || (
              <div className="flex gap-2 border border-[#2d2d2d] rounded-lg p-1 bg-card w-fit">
                <Button variant="ghost" size="sm" className="gap-2">
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
            )}

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
                    className="w-full pl-10 pr-4 py-2 bg-card border border-[#2d2d2d] rounded-lg text-primary placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
            </div>
            {onAdd && (
              <Button size="sm" className="flex items-center gap-2 w-40 h-10 bg-card border border-border cursor-pointer text-primary hover:bg-[#2d2d2d]/90 hover:text-primary" onClick={onAdd}>
                <Plus className="w-10 h-10" />
                <span>Agregar Cliente</span>
              </Button>
            )}
          </div>
        </div> */}

        <div className="border border-sidebar-border scale-99 rounded-lg overflow-auto">
          <table className="w-full overflow-auto">
            <thead className="border-b border border-sidebar-border">
              <tr>
                <th className="w-10 px-4 py-4 text-left">
                  <Checkbox />
                </th>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-4 text-left text-sm font-medium text-muted-foreground ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-sidebar-border">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-400/15 transition-colors">
                  <td className="w-10 px-4 py-4">
                    <Checkbox />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-1 ${column.className || ""}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <Button variant="ghost" size="sm" className="gap-2 h-8 text-white cursor-pointer" onClick={() => onView(item)}>
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        )}
                        {onEdit && (
                          <Button variant="ghost" size="sm" className="gap-2 h-8 text-white cursor-pointer" onClick={() => onEdit(item)}>
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 h-8 text-destructive hover:text-destructive cursor-pointer"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
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
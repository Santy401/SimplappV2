import React from "react";
import { TableProps } from "../../types/table.entity";
export interface ModernTableProps<T> extends Omit<TableProps<T>, 'isLoading' | 'title'> {
    title?: string;
    description?: React.ReactNode;
    addActionLabel?: string;
    emptyStateMessage?: string;
    isLoading?: boolean | TableProps<T>['isLoading'];
}
export declare function ModernTable<T extends {
    id: string | string;
}>({ data, columns, title, description, onAdd, onView, onExport, onDeleteMany, addActionLabel, isLoading, emptyStateMessage, searchable, pagination, itemsPerPage: initialItemsPerPage, }: ModernTableProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModernTable.d.ts.map
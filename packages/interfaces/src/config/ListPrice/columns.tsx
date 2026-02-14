"use client";

import { ListPrice } from "@domain/entities/ListPrice.entity";
import { TableActionsDropdown } from "@ui/index";
import { Edit, Eye, Trash2 } from "lucide-react";

export const createColumns = (
    handleViewListPrice: (listPrice: ListPrice) => void,
    handleEditListPrice: (listPrice: ListPrice) => void,
    handleDeleteListPrice: (listPrice: ListPrice) => void
) => {
    return [
        {
            key: "name",
            header: "Nombre",
            cell: (listPrice: ListPrice) => (
                <div className="flex items-center gap-3">
                    {listPrice.name}
                </div>
            )
        },
        {
            key: "description",
            header: "Descripción",
            cell: (listPrice: ListPrice) => (
                <div className="flex items-center gap-3">
                    {listPrice.description || 'Sin descripción'}
                </div>
            )
        },
        {
            key: "percentage",
            header: "Porcentaje",
            cell: (listPrice: ListPrice) => (
                <div className="flex items-center gap-3">
                    {listPrice.percentage ? `${listPrice.percentage}%` : '0%'}
                </div>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (listPrice: ListPrice) => (
                <TableActionsDropdown
                    onView={() => handleViewListPrice(listPrice)}
                    onEdit={() => handleEditListPrice(listPrice)}
                    onDelete={() => handleDeleteListPrice(listPrice)}
                />
            ),
        },
    ];
};
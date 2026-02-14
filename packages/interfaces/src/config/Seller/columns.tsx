"use client";

import { Seller } from "@domain/entities/Seller.entity";
import { TableActionsDropdown } from "@ui/index";
import { Edit, Eye, Trash2 } from "lucide-react";

export const createColumns = (
    handleViewCustomer: (seller: Seller) => void,
    handleEditCustomer: (seller: Seller) => void,
    handleDeleteCustomer: (seller: Seller) => void
) => {
    return [
        {
            key: "Name",
            header: "Nombre",
            cell: (seller: Seller) => (
                <div className="flex items-center gap-3">
                    {seller.name}
                </div>
            )
        },
        {
            key: "Identification",
            header: "Identificación",
            cell: (seller: Seller) => (
                <div className="flex items-center gap-3">
                    {seller.identification || 'N/A'}
                </div>
            )
        },
        {
            key: "Observations",
            header: "Observaciones",
            cell: (seller: Seller) => (
                <div className="flex items-center gap-3">
                    {seller.observation || 'Sin observaciones'}
                </div>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (seller: Seller) => (
                <TableActionsDropdown
                    onView={() => handleViewCustomer(seller)}
                    onEdit={() => handleEditCustomer(seller)}
                    onDelete={() => handleDeleteCustomer(seller)}
                />
            ),
        },
    ]
}
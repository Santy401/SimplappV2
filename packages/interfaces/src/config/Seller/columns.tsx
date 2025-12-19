"use client";

import { Seller } from "@domain/entities/Seller.entity";
import { Button } from "@ui/index";
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
            cell: (Seller: Seller) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCustomer(Seller)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Ver cliente"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCustomer(Seller)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(Seller)}
                        className="hover:bg-red-500/20 text-red-500 hover:text-red-400"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ]
}
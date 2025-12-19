"use client";

import { ListPrice } from "@domain/entities/ListPrice.entity";
import { Button } from "@ui/index";
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
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewListPrice(listPrice)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Ver lista de precios"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditListPrice(listPrice)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteListPrice(listPrice)}
                        className="hover:bg-red-500/20 text-red-500 hover:text-red-400"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];
};
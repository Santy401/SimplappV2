"use client";

import { Store } from "@domain/entities/Store.entity"
import { Button } from "@ui/index";
import { Edit, Eye, Trash2 } from "lucide-react";

export const createColumns = (
    handleEditCustomer: (client: Store) => void,
    handleDeleteCustomer: (client: Store) => void
) => {

    return [
        {
            key: "Name",
            header: "Nombre",
            cell: (store: Store) => (
                <div className="flex items-center gap-3">
                    {store.name}
                </div>
            )
        },
        {
            key: "Address",
            header: "Direccion",
            cell: (store: Store) => (
                <div className="flex items-center gap-3">
                    {store.address || "No Hay Direccion"}
                </div>
            )
        },
        {
            key: "Observations",
            header: "Observaciones",
            cell: (store: Store) => (
                <div className="flex items-center gap-3">
                    {store.observation || "No Hay Observaciones"}
                </div>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (store: Store) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handleViewCustomer(store)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Ver detalles"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCustomer(store)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(store)}
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

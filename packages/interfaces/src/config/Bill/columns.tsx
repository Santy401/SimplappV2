"use client";

import { Button } from "@ui/index";
import { Bill } from "@domain/entities";
import { DollarSign, Edit, Trash2 } from "lucide-react";

export const createColumns = (handleEditCustomer: (bill: Bill) => void,
    handleDeleteCustomer: (bill: Bill) => Promise<void>,
    handleViewCustomer: (bill: Bill) => void) => {
    return [
        {
            key: "basicInfo",
            header: "Número",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.number}
                    </div>
                </div>
            ),
        },
        {
            key: "client",
            header: "Cliente",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.clientName}
                    </div>
                </div>
            ),
        },
        {
            key: "date",
            header: "Fecha Creación",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.date.toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            key: "dueDate",
            header: "Fecha de vencimiento",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.dueDate.toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            key: "total",
            header: "Total",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.total}
                    </div>
                </div>
            ),
        },
        {
            key: "balance",
            header: "Por cobrar",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.balance}
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            header: "Estado",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
                        {bill.status}
                    </div>
                </div>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (bill: Bill) => (
                <div className="flex items-center gap-2">
                    <button>
                        <DollarSign />
                    </button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCustomer(bill)}
                        className="hover:bg-gray-800 hover:text-white"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(bill)}
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

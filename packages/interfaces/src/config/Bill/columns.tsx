"use client";

import { TableActionsDropdown } from "@ui/index";
import { Bill, BillStatus } from "@domain/entities";
import { Eye, Edit, Trash2 } from "lucide-react";

export const createColumns = (handleEditCustomer: (bill: Bill) => void,
    handleDeleteCustomer: (bill: Bill) => Promise<void>,
    handleViewCustomer: (bill: Bill) => void,
    handleMarkAsPaid: (bill: Bill) => Promise<void>) => {
    return [
        {
            key: "basicInfo",
            header: "Número",
            cell: (bill: Bill) => (
                <span className="font-medium">#{bill.number}</span>
            ),
        },
        {
            key: "client",
            header: "Cliente",
            cell: (bill: Bill) => (
                <span>{bill.clientName}</span>
            ),
        },
        {
            key: "date",
            header: "Fecha Creación",
            cell: (bill: Bill) => (
                <span className="text-muted-foreground">
                    {new Date(bill.date).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: "dueDate",
            header: "Vencimiento",
            cell: (bill: Bill) => (
                <span className="text-muted-foreground">
                    {new Date(bill.dueDate).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: "total",
            header: "Total",
            cell: (bill: Bill) => (
                <span className="font-medium">
                    ${Number(bill.total).toLocaleString('es-CO')}
                </span>
            ),
        },
        {
            key: "balance",
            header: "Por cobrar",
            cell: (bill: Bill) => (
                <span className="text-red-500 font-medium">
                    ${Number(bill.balance).toLocaleString('es-CO')}
                </span>
            ),
        },
        {
            key: "status",
            header: "Estado",
            cell: (bill: Bill) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        bill.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                            bill.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'}`}>
                    {bill.status === 'PAID' ? 'Pagada' :
                        bill.status === 'DRAFT' ? 'Borrador' :
                            bill.status === 'TO_PAY' ? 'Por Pagar' :
                                bill.status === 'CANCELLED' ? 'Cancelada' :
                                    bill.status === 'ISSUED' ? 'Emitida' :
                                        bill.status === 'PARTIALLY_PAID' ? 'Pago Parcial' :
                                            bill.status}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            cell: (bill: Bill) => (
                <TableActionsDropdown
                    onView={() => handleViewCustomer(bill)}
                    onEdit={() => handleEditCustomer(bill)}
                    onDelete={() => handleDeleteCustomer(bill)}
                    onMarkAsPaid={bill.status === BillStatus.ToPay ? () => handleMarkAsPaid(bill) : undefined}
                />
            ),
        }
    ]
}

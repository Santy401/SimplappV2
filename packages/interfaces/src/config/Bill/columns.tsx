"use client";

import { Button } from "@ui/index";
import { Bill } from "@domain/entities";
import { Eye, Edit, Trash2 } from "lucide-react";

export const createColumns = (handleEditCustomer: (bill: Bill) => void,
    handleDeleteCustomer: (bill: Bill) => Promise<void>,
    handleViewCustomer: (bill: Bill) => void) => {
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
                    {bill.status}
                </span>
            ),
        },
        // {
        //     key: "actions",
        //     header: "Acciones",
        //     cell: (bill: Bill) => (
        //         <div className="flex items-center gap-2">
        //             <Button
        //                 variant="ghost"
        //                 size="sm"
        //                 onClick={() => handleViewCustomer(bill)}
        //                 className="hover:bg-blue-500/10 text-blue-600 hover:text-blue-700"
        //                 title="Ver detalle"
        //             >
        //                 <Eye className="w-4 h-4" />
        //             </Button>
        //             {/* <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Pagos">
        //                 <DollarSign className="w-4 h-4" />
        //             </button> */}
        //             <Button
        //                 variant="ghost"
        //                 size="sm"
        //                 onClick={() => handleEditCustomer(bill)}
        //                 className="hover:bg-gray-100 text-gray-600"
        //                 title="Editar"
        //             >
        //                 <Edit className="w-4 h-4" />
        //             </Button>
        //             <Button
        //                 variant="ghost"
        //                 size="sm"
        //                 onClick={() => handleDeleteCustomer(bill)}
        //                 className="hover:bg-red-500/10 text-red-500 hover:text-red-600"
        //                 title="Eliminar"
        //             >
        //                 <Trash2 className="w-4 h-4" />
        //             </Button>
        //         </div>
        //     ),
        // },
    ]
}

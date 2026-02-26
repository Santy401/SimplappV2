"use Client";

import { Bill, BillDetail } from "@domain/entities/Bill.entity";
import { useBillCustomers } from "./useBillCustomers";
import { useMemo } from "react";
import { createColumns } from "../../../config/Bill/columns";

interface UseBillTableProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: BillDetail) => void;
    onDeleteSuccess?: () => void;
    onOpenPaymentModal?: (bill: Bill) => void;
}

export const useBillTable = ({ onSelect, onSelectBill, onDeleteSuccess, onOpenPaymentModal }: UseBillTableProps) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
        handleMarkAsPaid, // Kept for backwards compatibility if needed
    } = useBillCustomers({ onSelect, onSelectBill, onDeleteSuccess });

    const columns = useMemo(() =>
        createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer, onOpenPaymentModal || handleMarkAsPaid),
        [handleEditCustomer, handleDeleteCustomer, handleViewCustomer, onOpenPaymentModal, handleMarkAsPaid]
    );

    return {
        columns,
        handleAddCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleEditCustomer,
        handleExportCustomers,
        handleMarkAsPaid,
        onDeleteSuccess
    };
};
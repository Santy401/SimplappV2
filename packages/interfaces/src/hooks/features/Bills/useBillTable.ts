"use Client";

import { Bill, BillDetail } from "@domain/entities/Bill.entity";
import { useBillCustomers } from "./useBillCustomers";
import { useMemo } from "react";
import { createColumns } from "../../../config/Bill/columns";

interface UseBillTableProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: BillDetail) => void;
    onDeleteSuccess?: () => void;
    isLoading?: {
        deleteId: string | null;
        [key: string]: any;
    };
}

export const useBillTable = ({ onSelect, onSelectBill, onDeleteSuccess, isLoading }: UseBillTableProps) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
        handleMarkAsPaid,
    } = useBillCustomers({ onSelect, onSelectBill, onDeleteSuccess });

    const columns = useMemo(() =>
        createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer, handleMarkAsPaid, isLoading),
        [handleEditCustomer, handleDeleteCustomer, handleViewCustomer, handleMarkAsPaid, isLoading]
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
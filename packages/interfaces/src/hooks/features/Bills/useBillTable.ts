"use Client";

import { Bill, BillDetail } from "@domain/entities/Bill.entity";
import { useBillCustomers } from "./useBillCustomers";
import { useMemo } from "react";
import { createColumns } from "../../../config/Bill/columns";

interface UseBillTableProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: BillDetail) => void;
    onDeleteSuccess?: () => void;
}

export const useBillTable = ({ onSelect, onSelectBill, onDeleteSuccess }: UseBillTableProps) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
    } = useBillCustomers({ onSelect, onSelectBill, onDeleteSuccess });

    const columns = useMemo(() =>
     createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer),
    [handleEditCustomer, handleDeleteCustomer, handleViewCustomer]
    );

    return {
        columns,
        handleAddCustomer,
        handleDeleteCustomer,
        handleEditCustomer,
        handleExportCustomers,
        onDeleteSuccess
    };
};
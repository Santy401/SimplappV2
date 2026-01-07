"use Client";

import { Bill } from "@domain/entities/Bill.entity";
import { useBillCustomers } from "./useBillCustomers";
import { useMemo } from "react";
import { createColumns } from "../../../config/Bill/columns";

interface UseBillTableProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: Bill) => void;
    onDeleteSuccess?: () => void;
}

export const useBillTable = ({ onSelect, onSelectBill, onDeleteSuccess }: UseBillTableProps) => {
    const {
        handleAddCustomer,
        handleDeleteCustomer,
        handleEditCustomer,
        handleExportCustomers,
        handleViewCustomer,
    } = useBillCustomers({ onSelect, onSelectBill, onDeleteSuccess });

    const columns = useMemo(() =>
     createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer),
    [handleEditCustomer, handleDeleteCustomer, handleViewCustomer]
    );

    return {
        columns,
        handleAddCustomer,
        handleExportCustomers,
        onDeleteSuccess
    };
};
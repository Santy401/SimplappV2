"use Client";

import { useSellerCustomers } from "../../../../interfaces/src/hooks/features/Sellers/useSellerCustomers";
import { useMemo } from "react";
import { createColumns } from "../../config/Seller/columns";

export const useSellerTable = ({ onSelect, onSelectSeller, onDeleteSuccess }: any) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
    } = useSellerCustomers({ onSelect, onSelectSeller, onDeleteSuccess });

    const columns = useMemo(() =>
        createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer),
        [handleEditCustomer, handleDeleteCustomer, handleViewCustomer]
    );

    return {
        columns,
        handleAddCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleEditCustomer,
        handleExportCustomers,
        onDeleteSuccess
    };
};

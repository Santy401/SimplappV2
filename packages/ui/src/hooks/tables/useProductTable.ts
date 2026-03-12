"use Client";

import { useProductCustomers } from "../../../../interfaces/src/hooks/features/Products/useProductCustomers";
import { useMemo } from "react";
import { createColumns } from "../../config/Product/columns";

export const useProductTable = ({ onSelect, onSelectProduct, onDeleteSuccess }: any) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
    } = useProductCustomers({ onSelect, onSelectProduct, onDeleteSuccess });

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

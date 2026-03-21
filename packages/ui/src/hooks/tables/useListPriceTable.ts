"use Client";

import { useListPriceCustomers } from "../../../../interfaces/src/hooks/features/ListPrice/useListPriceCustomers";
import { useMemo } from "react";
import { createColumns } from "../../config/ListPrice/columns";

export const useListPriceTable = ({ onSelect, onSelectListPrice, onDeleteSuccess }: any) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
    } = useListPriceCustomers({ onSelect, onSelectListPrice, onDeleteSuccess });

    const columns = useMemo(() =>
        createColumns(handleViewCustomer, handleEditCustomer, handleDeleteCustomer),
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

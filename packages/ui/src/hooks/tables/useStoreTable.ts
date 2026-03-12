"use Client";

import { useStoreCustomers } from "../../../../interfaces/src/hooks/features/Stores/useStoreCustomers";
import { useMemo } from "react";
import { createColumns } from "../../config/Store/columns";

export const useStoreTable = ({ onSelect, onSelectStores, onDeleteSuccess }: any) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
    } = useStoreCustomers({ onSelect, onSelectStores, onDeleteSuccess });

    const columns = useMemo(() =>
        createColumns(handleEditCustomer, handleDeleteCustomer),
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

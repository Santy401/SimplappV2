"use Client";

import { useClientCustomers } from "../../../../interfaces/src/hooks/features/Clients/useClientCustomers";
import { useMemo } from "react";
import { createColumns } from "../../config/Clients/columns";

export const useClientTable = ({ onSelect, onSelectClient, onDeleteSuccess }: any) => {
    const {
        handleEditCustomer,
        handleDeleteCustomer,
        handleDeleteManyCustomers,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
    } = useClientCustomers({ onSelect, onSelectClient, onDeleteSuccess });

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

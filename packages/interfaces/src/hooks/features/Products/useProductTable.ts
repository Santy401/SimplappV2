"use client";

import { useMemo } from "react";
import { useProductCustomers } from "./useProductCustomers"
import { createColumns, ProductTable, createCompactProductColumns } from "../../../config/Product/columns";
import { Product } from "@domain/entities/Product.entity";

interface UseProductTableProps {
    onSelect?: (view: string) => void;
    onSelectProduct?: (product: Product) => void;
}

export const useProductTable = ({ onSelect, onSelectProduct }: UseProductTableProps) => {
    const {
        handleEditCustomer,
        handleAddCustomer,
        handleExportCustomers,
        handleDeleteCustomer
    } = useProductCustomers({ onSelect, onSelectProduct });

    const columns = useMemo(() => 
        createColumns(handleEditCustomer, handleEditCustomer, handleDeleteCustomer),
        [handleEditCustomer, handleDeleteCustomer]
    )

    return {
        columns,
        handleAddCustomer,
        handleExportCustomers,
        handleDeleteCustomer
    }
}
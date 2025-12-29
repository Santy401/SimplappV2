"use client";

import { useMemo } from "react";
import { useSellerCustomers } from "./useSellerCustomers";
import { createColumns } from "../../../config/Seller/columns";
import { Seller } from "@domain/entities/Seller.entity";

interface UseSellerTableProps {
    onSelect?: (view: string) => void;
    onSelectSeller?: (seller: Seller) => void;
}

export const useSellerTable = ({ onSelect, onSelectSeller }: UseSellerTableProps) => {
    const {
        handleEditCustomer,
        handleAddCustomer,
        handleExportCustomers,
        handleDeleteCustomer
    } = useSellerCustomers({ onSelect, onSelectSeller });

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
};
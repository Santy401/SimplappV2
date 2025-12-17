"use client";

import { useMemo } from "react";
import { useListPriceCustomers } from "./useListPriceCustomers";
import { createColumns } from "@interfaces/src/config/ListPrice/columns";
import { ListPrice } from "@domain/entities/ListPrice.entity";

interface UseListPriceTableProps {
  onSelect?: (view: string) => void;
  onSelectListPrice?: (listPrice: ListPrice) => void;
}

export const useListPriceTable = ({ onSelect, onSelectListPrice }: UseListPriceTableProps) => {
  const {
      handleEditCustomer,
      handleDeleteCustomer,
      handleViewCustomer,
      handleAddCustomer,
      handleExportCustomers
    } = useListPriceCustomers({ onSelect, onSelectListPrice });
  
    const columns = useMemo(() =>
      createColumns(handleViewCustomer, handleEditCustomer, handleDeleteCustomer),
      [handleViewCustomer, handleEditCustomer, handleDeleteCustomer]
    );
  
    return {
      columns,
      handleAddCustomer,
      handleExportCustomers
    };
};
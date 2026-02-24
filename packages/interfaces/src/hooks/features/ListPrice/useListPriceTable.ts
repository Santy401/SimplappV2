"use client";

import { useMemo } from "react";
import { useListPriceCustomers } from "./useListPriceCustomers";
import { createColumns } from "../../../config/ListPrice/columns";
import { ListPrice } from "@domain/entities/ListPrice.entity";

interface UseListPriceTableProps {
  onSelect?: (view: string) => void;
  onSelectListPrice?: (listPrice: ListPrice) => void;
  onDeleteSuccess?: () => void;
}

export const useListPriceTable = ({ onSelect, onSelectListPrice, onDeleteSuccess }: UseListPriceTableProps) => {
  const {
    handleEditCustomer,
    handleDeleteCustomer,
    handleViewCustomer,
    handleAddCustomer,
    handleExportCustomers,
    handleDeleteManyCustomers,
  } = useListPriceCustomers({ onSelect, onSelectListPrice, onDeleteSuccess });

  const columns = useMemo(() =>
    createColumns(handleViewCustomer, handleEditCustomer, handleDeleteCustomer),
    [handleViewCustomer, handleEditCustomer, handleDeleteCustomer]
  );

  return {
    columns,
    handleAddCustomer,
    handleDeleteCustomer,
    handleExportCustomers,
    handleDeleteManyCustomers,
  };
};
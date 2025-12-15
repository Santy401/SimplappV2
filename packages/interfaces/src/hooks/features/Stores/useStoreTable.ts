"use client";

import { useMemo } from "react";
import { useStoreCustomers } from "./useStoreCustomers";
import { createColumns } from "@interfaces/src/config/Store";
import { Store } from "@domain/entities/Store.entity";

interface UseStoreTableProps {
  onSelect?: (view: string) => void;
  onSelectStores?: (store: Store) => void;
}

export const useStoreTable = ({ onSelect, onSelectStores }: UseStoreTableProps) => {
  const {
    handleEditCustomer,
    handleAddCustomer,
    handleExportCustomers,
    handleDeleteCustomer
  } = useStoreCustomers({ onSelect, onSelectStores });

  const columns = useMemo(() =>
    createColumns(handleEditCustomer, handleDeleteCustomer),
    [handleAddCustomer, handleExportCustomers, handleDeleteCustomer]
  );

  return {
    columns,
    handleAddCustomer,
    handleExportCustomers,
    handleDeleteCustomer
  }
};
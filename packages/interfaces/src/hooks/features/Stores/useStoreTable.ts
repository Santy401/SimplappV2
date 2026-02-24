"use client";

import { useMemo } from "react";
import { useStoreCustomers } from "./useStoreCustomers";
import { createColumns } from "../../../config/Store";
import { Store } from "@domain/entities/Store.entity";

interface UseStoreTableProps {
  onSelect?: (view: string) => void;
  onSelectStores?: (store: Store) => void;
  onDeleteSuccess?: () => void;
}

export const useStoreTable = ({ onSelect, onSelectStores, onDeleteSuccess }: UseStoreTableProps) => {
  const {
    handleEditCustomer,
    handleAddCustomer,
    handleExportCustomers,
    handleDeleteCustomer,
    handleDeleteManyCustomers
  } = useStoreCustomers({ onSelect, onSelectStores, onDeleteSuccess });

  const columns = useMemo(() =>
    createColumns(handleEditCustomer, handleDeleteCustomer),
    [handleAddCustomer, handleExportCustomers, handleDeleteCustomer]
  );

  return {
    columns,
    handleAddCustomer,
    handleExportCustomers,
    handleDeleteCustomer,
    handleDeleteManyCustomers
  }
};
"use client";

import { useMemo } from "react";
import { useStoreCustomers } from "./useStoreCustomers";
import { createColumns } from "@interfaces/src/config/Store";

export const useStoreTable = () => {
  const {
    handleEditCustomer,
    handleAddCustomer,
    handleExportCustomers
  } = useStoreCustomers();

  const columns = useMemo(() =>
    createColumns(handleEditCustomer),
    [handleAddCustomer, handleExportCustomers]
  );

  return {
    columns,
    handleAddCustomer,
    handleExportCustomers
  }
};
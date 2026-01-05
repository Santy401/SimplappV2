"use client";

import { useMemo } from "react";
import { useClientCustomers } from "./useClientCustomers";
import { createColumns } from "../../../config/Clients/columns";
import { Client } from "@domain/entities/Client.entity";

interface UseClientTableProps {
  onSelect?: (view: string) => void;
  onSelectClient?: (client: Client) => void;
  onDeleteSuccess?: () => void;
}

export const useClientTable = ({ onSelect, onSelectClient, onDeleteSuccess }: UseClientTableProps) => {
  const {
    handleEditCustomer,
    handleDeleteCustomer,
    handleViewCustomer,
    handleAddCustomer,
    handleExportCustomers
  } = useClientCustomers({ onSelect, onSelectClient, onDeleteSuccess });

  const columns = useMemo(() =>
    createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer),
    [handleEditCustomer, handleDeleteCustomer, handleViewCustomer]
  );

  return {
    columns,
    handleAddCustomer,
    handleExportCustomers,
    onDeleteSuccess
  };
};
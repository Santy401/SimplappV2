"use client";

import { useMemo } from "react";
import { useClientCustomers } from "./useClientCustomers";
import { createColumns } from "@/app/ui/components/Ventas/Clientes/config/columns";
import { Client } from "@/domain/entities/Client.entity";

interface UseClientTableProps {
  onSelect?: (view: string) => void;
  onSelectClient?: (client: Client) => void;
}

export const useClientTable = ({ onSelect, onSelectClient }: UseClientTableProps) => {
  const {
    handleEditCustomer,
    handleDeleteCustomer,
    handleViewCustomer,
    handleAddCustomer,
    handleExportCustomers
  } = useClientCustomers({ onSelect, onSelectClient });

  const columns = useMemo(() =>
    createColumns(handleEditCustomer, handleDeleteCustomer, handleViewCustomer),
    [handleEditCustomer, handleDeleteCustomer, handleViewCustomer]
  );

  return {
    columns,
    handleAddCustomer,
    handleExportCustomers
  };
};
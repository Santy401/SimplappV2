"use client";

import { ModernTable, useClientTable, ModernTableSkeleton, Button } from "@simplapp/ui";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Client, OrganizationType } from "@domain/entities/Client.entity";
import { useClients } from "@interfaces/src/hooks/features/Clients/useClient";

export default function ClientesPage({
  onSelect = () => { },
  onSelectClient = () => { }
}: { onSelect?: (view: string) => void; onSelectClient?: (client: Client) => void }) {

  const { clients, isLoading, error, refetch } = useClients();
  const [tableversion, setTableversion] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'natural' | 'juridical' | 'suppliers' | 'branches'>('all');

  const refetchTable = () => {
    refetch();
    setTableversion(prev => prev + 1);
  };

  const {
    columns,
    handleAddCustomer,
    handleExportCustomers,
    handleDeleteManyCustomers,
  } = useClientTable({ onSelect, onSelectClient, onDeleteSuccess: refetchTable });

  const validClients = Array.isArray(clients) ? clients : [];

  const filteredClients = validClients.filter(client => {
    switch (activeFilter) {
      case 'natural': return client.organizationType === OrganizationType.NATURAL_PERSON;
      case 'juridical': return client.organizationType === OrganizationType.PERSON_JURIDIC;
      case 'suppliers': return client.is_supplier;
      case 'branches': return client.it_branches;
      default: return true;
    }
  });

  if (isLoading.fetch && validClients.length === 0) {
    return <div className="max-w-6xl mx-auto px-2 py-8"><ModernTableSkeleton rowCount={5} columnCount={6} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={handleAddCustomer} variant="default">
          <UserPlus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div> */}
      <ModernTable
        data={filteredClients}
        columns={columns}
        title="Clientes"
        description="Gestiona tus clientes"
        onAdd={handleAddCustomer}
        addActionLabel="Nuevo Cliente"
        onExport={handleExportCustomers}
        onDeleteMany={handleDeleteManyCustomers}
      />
    </div>
  );
}

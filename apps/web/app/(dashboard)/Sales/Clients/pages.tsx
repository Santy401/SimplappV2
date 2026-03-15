"use client";

import { ModernTable, useClientTable, ModernTableSkeleton } from "@simplapp/ui";
import { useState } from "react";
import { Client, OrganizationType } from "@domain/entities/Client.entity";
import { useClients } from "@interfaces/src/hooks/features/Clients/useClient";

export default function ClientesPage({
  onSelect = () => { },
  onSelectClient = () => { }
}: { onSelect?: (view: string) => void; onSelectClient?: (client: Client) => void }) {

  const { clients, isLoading, error, refetch } = useClients();
  const [tableversion, setTableversion] = useState(0);
  const [activeFilter, _setActiveFilter] = useState<'all' | 'natural' | 'juridical' | 'suppliers' | 'branches'>('all');

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

  // Filtrado lógico (se mantiene simple)
  const filteredClients = validClients.filter(client => {
    switch (activeFilter) {
      case 'natural': return client.organizationType === OrganizationType.NATURAL_PERSON;
      case 'juridical': return client.organizationType === OrganizationType.PERSON_JURIDIC;
      case 'suppliers': return client.is_supplier;
      case 'branches': return client.it_branches;
      default: return true;
    }
  });

  // LOGICA CLEAN: Solo esqueleto si no hay datos previos
  const isInitialLoading = isLoading.fetch && validClients.length === 0;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-8 text-center text-red-500">
        Error al cargar clientes. Por favor reintente.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8 animate-in fade-in duration-500">
      {isInitialLoading ? (
        <ModernTableSkeleton rowCount={5} columnCount={6} />
      ) : (
        <ModernTable
          key={`clients-table-v-${tableversion}`}
          data={filteredClients}
          columns={columns}
          title="Clientes"
          description="Gestiona tus clientes y proveedores desde un solo lugar."
          onAdd={handleAddCustomer}
          addActionLabel="Nuevo Cliente"
          onExport={handleExportCustomers}
          onDeleteMany={handleDeleteManyCustomers}
          isLoading={{
            fetch: isLoading.fetch,
            create: isLoading.create,
            update: isLoading.update
          }}
        />
      )}
    </div>
  );
}

"use client";

import { ModernTable, useStoreTable, ModernTableSkeleton } from "@simplapp/ui";
import { Warehouse } from "lucide-react";
import { useState } from "react";
import { useStore } from "@interfaces/src/hooks/features/Stores/useStore";

interface StoresPageProps {
  onSelect?: (id: string) => void;
  onSelectStores?: (id: string) => void;
}

export default function StoresPage({
  onSelect = () => { },
  onSelectStores = () => { }
}: StoresPageProps) {
  // isLoading.fetch en useStore (React Query) solo es true en el primer fetch sin cache
  const { stores, isLoading, error } = useStore();
  const [tableversion, setTableversion] = useState(0);

  const refetchTable = () => {
    setTableversion(prev => prev + 1);
  };

  const {
    columns,
    handleAddCustomer,
    handleDeleteCustomer,
    handleDeleteManyCustomers,
    handleEditCustomer,
    handleExportCustomers,
  } = useStoreTable({ onSelect, onSelectStores, onDeleteSuccess: refetchTable });

  const validData = Array.isArray(stores) ? stores : [];

  // Lógica de Skeleton Inteligente: 
  // Solo se muestra si está cargando Y no tenemos datos previos en el caché de React Query.
  const isInitialLoading = isLoading.fetch && validData.length === 0;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-8 text-center text-red-500">
        Error al cargar bodegas. Por favor reintente.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8 animate-in fade-in duration-500">
      {isInitialLoading ? (
        <div className="animate-in fade-in duration-200">
          <ModernTableSkeleton rowCount={5} columnCount={6} />
        </div>
      ) : (
        <ModernTable
          key={`stores-table-v-${tableversion}`}
          data={validData}
          columns={columns}
          title="Bodegas"
          description="Gestiona y organiza tus espacios de almacenamiento e inventario."
          onAdd={handleAddCustomer}
          addActionLabel="Nueva Bodega"
          onDelete={handleDeleteCustomer}
          onDeleteMany={handleDeleteManyCustomers}
          onEdit={handleEditCustomer}
          onExport={handleExportCustomers}
          emptyIcon={Warehouse}
          emptyTitle="No hay bodegas registradas"
          emptyDescription="Crea tu primera bodega para empezar a gestionar tu stock."
          isLoading={{
             fetch: isLoading.fetch,
             create: isLoading.create,
             update: isLoading.update,
             deleteId: null,
             deleteMany: isLoading.delete,
             export: false,
             view: false,
             rowId: null,
          }}
        />
      )}
    </div>
  );
}

"use client";

import { ModernTable, useSellerTable, ModernTableSkeleton } from "@simplapp/ui";
import { Users } from "lucide-react";
import { useState } from "react";
import { useSeller } from "@interfaces/src/hooks/features/Sellers/useSeller";

interface SellersPageProps {
  onSelect?: (id: string) => void;
  onSelectSeller?: (id: string) => void;
}

export default function SellersPage({
  onSelect = () => { },
  onSelectSeller = () => { }
}: SellersPageProps) {
  const { sellers, isLoading, error, refetch } = useSeller();
  const [tableversion, setTableversion] = useState(0);

  const refetchTable = () => {
    refetch();
    setTableversion(prev => prev + 1);
  };

  const {
    columns,
    handleAddCustomer,
    handleDeleteCustomer,
    handleDeleteManyCustomers,
    handleEditCustomer,
    handleExportCustomers,
  } = useSellerTable({ onSelect, onSelectSeller, onDeleteSuccess: refetchTable });

  const validData = Array.isArray(sellers) ? sellers : [];

  // Lógica de Skeleton Inteligente: 
  // Solo se muestra si está cargando Y no tenemos datos previos en el caché de React Query.
  const isInitialLoading = isLoading.fetch && validData.length === 0;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-8 text-center text-red-500">
        Error al cargar vendedores. Por favor reintente.
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
          key={`sellers-table-v-${tableversion}`}
          data={validData}
          columns={columns}
          title="Vendedores"
          description="Gestiona y organiza tu equipo de ventas."
          onAdd={handleAddCustomer}
          addActionLabel="Nuevo Vendedor"
          onDelete={handleDeleteCustomer}
          onDeleteMany={handleDeleteManyCustomers}
          onEdit={handleEditCustomer}
          onExport={handleExportCustomers}
          emptyIcon={Users}
          emptyTitle="No hay vendedores registrados"
          emptyDescription="Crea tu primer vendedor para empezar a gestionar tus ventas de forma presencial."
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

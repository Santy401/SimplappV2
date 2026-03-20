"use client";

import { ModernTable, useListPriceTable, ModernTableSkeleton } from "@simplapp/ui";
import { Tags } from "lucide-react";
import { useState } from "react";
import { useListPrice } from "@interfaces/src/hooks/features/ListPrice/useListPrice";

interface ListPricePageProps {
  onSelect?: (id: string) => void;
  onSelectListPrice?: (id: string) => void;
}

export default function ListPricePage({
  onSelect = () => { },
  onSelectListPrice = () => { }
}: ListPricePageProps) {
  const { listPrices, isLoading, error, refrech } = useListPrice();
  const [tableversion, setTableversion] = useState(0);

  const refetchTable = () => {
    refrech();
    setTableversion(prev => prev + 1);
  };

  const {
    columns,
    handleAddCustomer,
    handleDeleteCustomer,
    handleDeleteManyCustomers,
    handleEditCustomer,
    handleExportCustomers,
  } = useListPriceTable({ onSelect, onSelectListPrice, onDeleteSuccess: refetchTable });

  const validData = Array.isArray(listPrices) ? listPrices : [];

  // Lógica de Skeleton Inteligente: 
  // Solo se muestra si está cargando Y no tenemos datos previos en el caché de React Query.
  const isInitialLoading = isLoading.fetch && validData.length === 0;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-8 text-center text-red-500">
        Error al cargar listas de precios. Por favor reintente.
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
          key={`list-price-table-v-${tableversion}`}
          data={validData}
          columns={columns}
          title="Listas de Precios"
          description="Gestiona tus listas de precios y organiza tus tarifas de venta."
          onAdd={handleAddCustomer}
          addActionLabel="Nueva Lista"
          onDelete={handleDeleteCustomer}
          onDeleteMany={handleDeleteManyCustomers}
          onEdit={handleEditCustomer}
          onExport={handleExportCustomers}
          emptyIcon={Tags}
          emptyTitle="No hay listas de precios registradas"
          emptyDescription="Crea tu primera lista de precios para empezar a gestionar tus tarifas de venta."
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

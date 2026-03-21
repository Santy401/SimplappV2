"use client";

import { ModernTable, useProductTable, ModernTableSkeleton } from "@simplapp/ui";
import { Package } from "lucide-react";
import { useState } from "react";
import { useProduct } from "@interfaces/src/hooks/features/Products/useProduct";

interface ProductsPageProps {
  onSelect?: (id: string) => void;
  onSelectProduct?: (id: string) => void;
}

export default function ProductsPage({
  onSelect = () => { },
  onSelectProduct = () => { }
}: ProductsPageProps) {
  const { products, isLoading, error, refetch } = useProduct();
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
  } = useProductTable({ onSelect, onSelectProduct, onDeleteSuccess: refetchTable });

  const validProducts = (Array.isArray(products) ? products : []) as any[];

  // LOGICA CLEAN: Solo esqueleto si no hay datos previos
  const isInitialLoading = isLoading.fetch && validProducts.length === 0;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-8 text-center text-red-500">
        Error al cargar productos. Por favor reintente.
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
          key={`products-table-v-${tableversion}`}
          data={validProducts}
          columns={columns as any}
          title="Productos"
          description="Controla tu inventario, precios y stock en tiempo real."
          onAdd={handleAddCustomer}
          addActionLabel="Nuevo Producto"
          onDelete={handleDeleteCustomer as any}
          onDeleteMany={handleDeleteManyCustomers as any}
          onEdit={handleEditCustomer as any}
          onExport={handleExportCustomers}
          emptyIcon={Package}
          emptyTitle="No hay productos registrados"
          emptyDescription="Crea tu primer producto para empezar a gestionar tu inventario y ventas."
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

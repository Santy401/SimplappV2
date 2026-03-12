"use client";

import { ModernTable, useProductTable, ModernTableSkeleton, Button } from "@simplapp/ui";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useProduct } from "@interfaces/src/hooks/features/Products/useProduct";

export default function ProductsPage({
  onSelect = () => { },
  onSelectProduct = () => { }
}: any) {
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

  if (isLoading.fetch && validProducts.length === 0) {
    return <div className="max-w-6xl mx-auto px-2 py-8"><ModernTableSkeleton rowCount={5} columnCount={6} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={handleAddCustomer} variant="default">
          <UserPlus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </div> */}
      <ModernTable
        data={validProducts}
        columns={columns as any}
        title="Productos"
        description="Gestiona tus productos"
        onAdd={handleAddCustomer}
        addActionLabel="Nuevo Producto"
        onDelete={handleDeleteCustomer as any}
        onDeleteMany={handleDeleteManyCustomers as any}
        onEdit={handleEditCustomer as any}
        onExport={handleExportCustomers}
      />
    </div>
  );
}

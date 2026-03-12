"use client";

import { ModernTable, useListPriceTable, ModernTableSkeleton, Button } from "@simplapp/ui";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useListPrice } from "@interfaces/src/hooks/features/ListPrice/useListPrice";

export default function ListPricePage({
  onSelect = () => { },
  onSelectListPrice = () => { }
}: any) {
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

  if (isLoading.fetch && validData.length === 0) {
    return <div className="max-w-6xl mx-auto px-2 py-8"><ModernTableSkeleton rowCount={5} columnCount={6} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Listas de Precios</h1>
        <Button onClick={handleAddCustomer} variant="default">
          <UserPlus className="w-4 h-4" /> Nueva Lista
        </Button>
      </div> */}
      <ModernTable
        data={validData}
        columns={columns}
        title="Listas de Precios"
        description="Gestiona tus listas de precios"
        onAdd={handleAddCustomer}
        addActionLabel="Nueva Lista"
        onDelete={handleDeleteCustomer}
        onDeleteMany={handleDeleteManyCustomers}
        onEdit={handleEditCustomer}
        onExport={handleExportCustomers}
      />
    </div>
  );
}

"use client";

import { ModernTable, useStoreTable, ModernTableSkeleton, Button } from "@simplapp/ui";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useStore } from "@interfaces/src/hooks/features/Stores/useStore";

export default function StoresPage({
  onSelect = () => { },
  onSelectStores = () => { }
}: any) {
  const { stores, isLoading, error, refrech } = useStore();
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
  } = useStoreTable({ onSelect, onSelectStores, onDeleteSuccess: refetchTable });

  const validData = Array.isArray(stores) ? stores : [];

  if (isLoading.fetch && validData.length === 0) {
    return <div className="max-w-5xl mx-auto px-4 py-8"><ModernTableSkeleton rowCount={5} columnCount={6} /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bodegas</h1>
        <Button onClick={handleAddCustomer} variant="default">
          <UserPlus className="w-4 h-4" /> Nueva Bodega
        </Button>
      </div>
      <ModernTable
        data={validData}
        columns={columns}
        onDelete={handleDeleteCustomer}
        onDeleteMany={handleDeleteManyCustomers}
        onEdit={handleEditCustomer}
        onExport={handleExportCustomers}
      />
    </div>
  );
}

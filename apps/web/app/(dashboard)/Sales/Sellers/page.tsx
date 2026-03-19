"use client";

import { ModernTable, useSellerTable, ModernTableSkeleton } from "@simplapp/ui";
import { useState } from "react";
import { useSeller } from "@interfaces/src/hooks/features/Sellers/useSeller";

export default function SellersPage({
  onSelect = () => { },
  onSelectSeller = () => { }
}: any) {
  const { sellers, isLoading, refetch } = useSeller();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  if (isLoading.fetch && validData.length === 0) {
    return <div className="max-w-6xl mx-auto px-2 py-8"><ModernTableSkeleton rowCount={5} columnCount={6} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendedores</h1>
        <Button onClick={handleAddCustomer} variant="default">
          <UserPlus className="w-4 h-4" /> Nuevo Vendedor
        </Button>
      </div> */}
      <ModernTable
        data={validData}
        columns={columns}
        title="Vendedores"
        description="Gestiona tus vendedores"
        onAdd={handleAddCustomer}
        addActionLabel="Nuevo Vendedor"
        onDelete={handleDeleteCustomer}
        onDeleteMany={handleDeleteManyCustomers}
        onEdit={handleEditCustomer}
        onExport={handleExportCustomers}
      />
    </div>
  );
}

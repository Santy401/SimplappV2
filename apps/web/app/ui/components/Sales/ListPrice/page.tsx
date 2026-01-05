"use client";

import { ListPrice } from "@domain/entities/ListPrice.entity";
import { useListPrice } from "@interfaces/src/hooks/features/ListPrice/useListPrice";
import { useListPriceTable } from "@interfaces/src/hooks/features/ListPrice/useListPriceTable";
import { DataTable, Button, Loading } from "@simplapp/ui";
import { Tag, Plus } from "lucide-react";

interface ListPriceProps {
    onSelect?: (view: string) => void;
    onSelectListPrice?: (listPrice: ListPrice) => void;
}

export default function ListPrices({
    onSelect = () => { },
    onSelectListPrice = () => { }
}: ListPriceProps) {
    const { listPrices, isLoading, error } = useListPrice();
    const { columns, handleAddCustomer, handleExportCustomers } = useListPriceTable({ onSelect, onSelectListPrice });
    const validListPrices = listPrices || [];


      if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Loading />
              {/* <p className="text-gray-600 ">Cargando clientes...</p> */}
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md">
              <h3 className="text-lg font-semibold mb-2">Error al cargar clientes</h3>
              <p className="mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          </div>
        );
      }

    return (
        <div className="min-h-fit">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Listas de Precios</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona tus listas de precios y sus porcentajes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleExportCustomers}
                            className="gap-2 text-[15px]"
                        >
                            Exportar
                        </Button>
                        <Button
                            onClick={handleAddCustomer}
                            className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva Lista de Precios
                        </Button>
                    </div>
                </div>

                {validListPrices.length > 0 ? (
                    <div className="rounded-xl overflow-hidden">
                        <DataTable
                            data={validListPrices}
                            columns={columns}
                            title=""
                            searchable={true}
                            pagination={true}
                            itemsPerPage={10}
                            onAdd={handleAddCustomer}
                            onExport={handleExportCustomers}
                            className="bg-transparent"
                        />
                    </div>
                ) : (
                    <div className="text-center p-12 border border-sidebar-border rounded-xl mt-4">
                        <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay listas de precios registradas</h3>
                        <p className="text-muted-foreground mb-6">
                            Comienza agregando tu primera lista de precios
                        </p>
                        <Button 
                            onClick={handleAddCustomer} 
                            className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Agrega Tu Primera Lista de Precios
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
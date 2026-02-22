"use client";

import { Store as Storee } from "@domain/entities/Store.entity";
import { useStore } from "@interfaces/src/hooks/features/Stores/useStore";
import { useStoreTable } from "@interfaces/src/hooks/features/Stores/useStoreTable";
import { Button, DataTable, Loading } from "@simplapp/ui";
import { Store } from "lucide-react";
import { useEffect, useState } from "react";

interface StoresProps {
  onSelect?: (view: string) => void;
  onSelectStores?: (store: Storee) => void;
}

export default function Bodega({
  onSelect = () => { },
  onSelectStores = () => { }
}: StoresProps) {

  const { stores, isLoading, error, refrech } = useStore();

  const refetchTable = () => {
    setTableVersion(prev => prev + 1);
  }
  const { columns, handleAddCustomer, handleDeleteManyCustomers } = useStoreTable({ onSelect, onSelectStores, onDeleteSuccess: refetchTable });
  const [tableVersion, setTableVersion] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState({
    export: false,
    delete: false,
    create: false,
    update: false,
    get: false,
  });

  useEffect(() => {
    refrech();
  }, [tableVersion]);

  const ValidStores = stores || [];

  if (isLoading.fetch && stores.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loading />
          {/* <p className="text-gray-600 ">Cargando clientes...</p> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bodegas</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus Bodegas
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { }}
              className="gap-2 text-[15px]"
            >
              Exportar
            </Button>
            <Button
              onClick={localLoading.create ? () => { } : handleAddCustomer}
              disabled={localLoading.create}
              className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
            >
              {/* <UserPlus className="w-4 h-4" /> */}
              Nueva Bodega
            </Button>
          </div>
        </div>

        {ValidStores.length > 0 ? (
          <div className="rounded-xl overflow-hidden">
            <DataTable
              data={ValidStores}
              columns={columns}
              title=""
              searchable={true}
              pagination={true}
              itemsPerPage={10}
              onAdd={handleAddCustomer}
              onExport={() => { }}
              onDeleteMany={handleDeleteManyCustomers}
              className="bg-transparent"
              isLoading={{
                fetch: isLoading.fetch,
                create: isLoading.create,
                update: isLoading.update,
                deleteId: deletingId,
                deleteMany: false,
                export: localLoading.export,
                view: false,
                rowId: deletingId,
              }}
            />
          </div>
        ) : (
          <div className="text-center p-12 border border-sidebar-border rounded-xl bg-white mt-4">
            <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay Bodegas registrados</h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primera Bodega
            </p>
            <Button onClick={handleAddCustomer} className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer">
              {/* <UserPlus className="w-4 h-4" /> */}
              Agrega Tu Primera Bodega
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
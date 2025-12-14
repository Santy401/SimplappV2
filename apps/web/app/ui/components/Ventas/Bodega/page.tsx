"use client";

import { Store as Storee } from "@domain/entities/Store.entity";
import { useStore } from "@interfaces/src/hooks/features/Store/useStore";
import { useStoreTable } from "@interfaces/src/hooks/features/Store/useStoreTable";
import { Button, DataTable } from "@simplapp/ui";
import { Store } from "lucide-react";

interface StoresProps {
  onSelect?: (view: string) => void;
  onSelectStores?: (store: Storee) => void;
}

export default function Bodega({
  onSelect = () => { }, 
  onSelectStores = () => { }  
}: StoresProps) {

  const { stores } = useStore();
    
  const { columns, handleAddCustomer } = useStoreTable({ onSelect, onSelectStores });

  const ValidStores = stores || [];

 return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bodegas</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus Bodegas
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {}}
              className="gap-2"
            >
              Exportar
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="bg-foreground hover:bg-neutral-900 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition text-background"
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
              onExport={() => {}}
              className="bg-transparent"
            />
          </div>
        ) : (
          <div className="text-center p-12 border border-sidebar-border rounded-xl mt-4">
            <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay Bodegas registrados</h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primera Bodega
            </p>
            <Button onClick={handleAddCustomer} className="gap-2 bg-foreground">
              {/* <UserPlus className="w-4 h-4" /> */}
              Agrega Tu Primera Bodega
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
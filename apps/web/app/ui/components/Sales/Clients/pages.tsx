"use client";

import { DataTable } from "@simplapp/ui";
import { Button } from '@simplapp/ui';
import {
  UserCheck,
  DollarSign,
  Tag,
  UserPlus,
  MapPin,
} from "lucide-react";
import { Client, OrganizationType } from "@domain/entities/Client.entity";
import { useClients } from "@interfaces/src/hooks/index"
import { useClientTable } from "@interfaces/src/hooks/index";
import { Loading } from '@simplapp/ui'
import { useState, useEffect } from "react";

interface ClientesProps {
  onSelect?: (view: string) => void;
  onSelectClient?: (client: Client) => void;
}

export default function ClientesPage({
  onSelect = () => { },
  onSelectClient = () => { }
}: ClientesProps) {

  const { clients, isLoading, error, refetch } = useClients();

  const [tableversion, setTableversion] = useState(0);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [localLoading, setLocalLoading] = useState({
    export: false,
    delete: false,
    create: false,
    update: false,
    get: false,
  });


  const refetchTable = () => {
    refetch();
    setTableversion(prev => prev + 1);
  };

  const {
    columns,
    handleAddCustomer,
    handleExportCustomers
  } = useClientTable({ onSelect, onSelectClient, onDeleteSuccess: refetchTable });

  const validClients = clients || [];

  const totalClients = validClients.length;
  const naturalPersons = validClients.filter(c => c.organizationType === OrganizationType.NATURAL_PERSON).length;
  const juridicalPersons = validClients.filter(c => c.organizationType === OrganizationType.PERSON_JURIDIC).length;
  const suppliers = validClients.filter(c => c.is_supplier).length;
  const withBranches = validClients.filter(c => c.it_branches).length;

  if (isLoading.fetch && clients.length === 0) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
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
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tu lista de clientes y proveedores
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExportCustomers}
              className="gap-2 text-[15px] bg-input/55 cursor-pointer py-2 px-2 rounded"
            >
              Exportar
            </Button>
            <Button
              onClick={handleAddCustomer}
              disabled={localLoading.create}
              className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
            >
              {localLoading.create ? <Loading /> : <UserPlus className="w-4 h-4" />}
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="border border-sidebar-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold text-foreground">
                  {totalClients}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <UserCheck className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="border border-sidebar-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Naturales</div>
                <div className="text-2xl font-bold text-foreground">
                  {naturalPersons}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className=" border border-sidebar-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Jurídicas</div>
                <div className="text-2xl font-bold text-foreground">
                  {juridicalPersons}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Tag className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className=" border border-sidebar-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Proveedores</div>
                <div className="text-2xl font-bold text-foreground">
                  {suppliers}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className=" border border-sidebar-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Con Sucursales</div>
                <div className="text-2xl font-bold text-foreground">
                  {withBranches}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <MapPin className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        {validClients.length > 0 ? (
          <div className="rounded-xl overflow-hidden">
            <DataTable
              key={`clients-table-version-${tableversion}`}
              data={validClients}
              columns={columns}
              title=""
              searchable={true}
              pagination={true}
              itemsPerPage={10}
              onAdd={handleAddCustomer}
              onExport={handleExportCustomers}
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
          <div className="text-center p-12 border border-sidebar-border rounded-xl mt-4">
            <UserCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay clientes registrados</h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primer cliente con datos completos
            </p>
            <Button onClick={handleAddCustomer} className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Agregar Primer Cliente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
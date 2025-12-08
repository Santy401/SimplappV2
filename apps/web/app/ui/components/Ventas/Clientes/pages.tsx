"use client";

import { DataTable } from "@/app/ui/components/shared/DataTable";
import { Button } from "@/app/ui/cn/components/ui/button";
import {
  UserCheck,
  DollarSign,
  Tag,
  UserPlus,
  MapPin,
} from "lucide-react";
import { Client, OrganizationType } from "@/domain/entities/Client.entity";
import { useClients } from "@/interfaces/hooks/features/Clients/useClient";
import { useClientTable } from "@/interfaces/hooks/features/Clients/useClientTable";

interface ClientesProps {
  onSelect?: (view: string) => void;
  onSelectClient?: (client: Client) => void;
}

export default function ClientesPage({
  onSelect = () => { }, 
  onSelectClient = () => { }  
}: ClientesProps) {
  
  const { clients } = useClients();
  
  const { 
    columns,
    handleAddCustomer, 
    handleExportCustomers 
  } = useClientTable({ onSelect, onSelectClient });

  // const clients = customersData as unknown as Client[];

  const validClients = clients || [];

  const totalClients = validClients.length;
  const naturalPersons = validClients.filter(c => c.organizationType === OrganizationType.NATURAL_PERSON).length;
  const juridicalPersons = validClients.filter(c => c.organizationType === OrganizationType.PERSON_JURIDIC).length;
  const suppliers = validClients.filter(c => c.is_supplier).length;
  const withBranches = validClients.filter(c => c.it_branches).length;

  return (
    <div className="min-h-screen">
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
              className="gap-2"
            >
              Exportar
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="gap-2 bg-foreground hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4" />
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
              data={validClients}
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
            <UserCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay clientes registrados</h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primer cliente con datos completos
            </p>
            <Button onClick={handleAddCustomer} className="gap-2 bg-foreground">
              <UserPlus className="w-4 h-4" />
              Agregar Primer Cliente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
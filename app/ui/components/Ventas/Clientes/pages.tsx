"use client";

import { DataTable } from "@/app/ui/components/shared/DataTable";
import { Button } from "@/app/ui/cn/components/ui/button";
import { useEffect, useState } from "react";
import {
  UserCheck,
  DollarSign,
  Tag,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Hash
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useClients } from "@/interfaces/hooks/features/Clients/useClient";
import { customersData } from "@/interfaces/data/customers";
import { Client, OrganizationType, IdentificationType } from "@/domain/entities/Client.entity";
import { toast } from "sonner";

interface ClientesProps {
  onSelect?: (view: string) => void;
  onSelectClient?: (client: Client) => void;
}

export default function ClientesPage({ onSelect, onSelectClient }: ClientesProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { clients, isLoading, error, deleteClient } = useClients();
  const router = useRouter();

  // const clients = customersData as unknown as Client[];


  const validClients = clients || [];

  const getFullName = (client: Client) => {
    if (client.organizationType === OrganizationType.PERSON_JURIDIC && client.commercialName) {
      return client.commercialName;
    }

    let name = client.firstName || '';
    if (client.otherNames) name += ` ${client.otherNames}`;
    if (client.firstLastName) name += ` ${client.firstLastName}`;
    if (client.secondLastName) name += ` ${client.secondLastName}`;

    return name.trim() || client.commercialName || 'Sin nombre';
  };

  const formatIdentificationType = (type: IdentificationType) => {
    const typeMap: Record<IdentificationType, string> = {
      [IdentificationType.CITIZEN_ID]: "C.C.",
      [IdentificationType.NIT]: "NIT",
      [IdentificationType.PASSPORT]: "Pasaporte",
      [IdentificationType.TAX_ID]: "C.E.",
      [IdentificationType.FOREIGN_ID]: "ID Ext."
    };
    return typeMap[type] || type;
  };

  const columns = [
    {
      key: "basicInfo",
      header: "Información Básica",
      cell: (client: Client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-semibold">
            {getFullName(client).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-white truncate max-w-[180px]">
              {getFullName(client)}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Tag size={12} />
              {client.organizationType === OrganizationType.PERSON_JURIDIC ? "Jurídica" : "Natural"}
            </div>
            {client.code && (
              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Hash size={10} />
                {client.code}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "identification",
      header: "Identificación",
      cell: (client: Client) => (
        <div className="space-y-1 min-w-[140px]">
          <div className="font-medium text-gray-300">
            {formatIdentificationType(client.identificationType)}
          </div>
          <div className="text-sm text-gray-500 font-mono">
            {client.identificationNumber}
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contacto",
      cell: (client: Client) => (
        <div className="space-y-1 min-w-[160px]">
          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail size={12} className="text-gray-400" />
              <span className="text-gray-500 truncate max-w-[150px]">
                {client.email}
              </span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={12} className="text-gray-400" />
              <span className="text-gray-400">
                {client.phone}
              </span>
            </div>
          )}
          {!client.email && !client.phone && (
            <span className="text-sm text-gray-500 italic">Sin contacto</span>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Ubicación",
      cell: (client: Client) => (
        <div className="space-y-1 min-w-[140px]">
          <div className="font-medium text-gray-300 text-sm">
            {client.country || "Sin país"}
          </div>
          {(client.department || client.municipality) && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={10} />
              {[client.department, client.municipality].filter(Boolean).join(", ")}
            </div>
          )}
          {client.postalCode && (
            <div className="text-xs text-gray-400">
              CP: {client.postalCode}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "address",
      header: "Dirección",
      cell: (client: Client) => (
        <div className="text-sm text-gray-500 max-w-[180px] truncate">
          {client.address || "Sin dirección"}
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      cell: (client: Client) => (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${client.is_supplier
          ? "bg-green-500/20 text-green-500 border border-green-500/30"
          : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
          }`}>
          <div className={`w-2 h-2 rounded-full ${client.is_supplier ? "bg-green-500" : "bg-blue-500"
            }`} />
          {client.is_supplier ? "Proveedor" : "Cliente"}
        </div>
      ),
    },
    {
      key: "features",
      header: "Características",
      cell: (client: Client) => (
        <div className="flex flex-wrap gap-1">
          {client.it_branches && (
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
              Sucursales
            </span>
          )}
          {client.includeCcBcc && (
            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
              Cc/Bcc
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (client: Client) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewCustomer(client)}
            className="hover:bg-gray-800 hover:text-white"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCustomer(client)}
            className="hover:bg-gray-800 hover:text-white"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCustomer(client)}
            className="hover:bg-red-500/20 text-red-500 hover:text-red-400"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleEditCustomer = (client: Client) => {
    if (onSelectClient) {
      onSelectClient(client);
    }

    if (onSelect) {
      onSelect('ventas-clientes-create');
    }
  };

  const handleDeleteCustomer = async (client: Client) => {
    if (confirm(`¿Estás seguro de eliminar a ${getFullName(client)}?`)) {
      const result = await deleteClient(client.id);
      if (result) {
        toast.success('Cliente eliminado');
      } else {
        toast.error('Error al eliminar cliente');
      }
    }
  };

  const handleViewCustomer = (client: Client) => {
    console.log("Ver detalles de cliente:", client);
    if (onSelect) {
      onSelect('ventas-clientes-view');
    }
  };

  const handleAddCustomer = () => {
    console.log("Agregar nuevo cliente");
    if (onSelect) {
      onSelect('ventas-clientes-create');
    }
  };

  const handleExportCustomers = () => {
    console.log("Exportar clientes");
    // Logic
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemDark);
      if (systemDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

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
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className=" border rounded-xl p-4">
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

          <div className=" border rounded-xl p-4">
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

          <div className=" border rounded-xl p-4">
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

          <div className=" border rounded-xl p-4">
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

          <div className=" border rounded-xl p-4">
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
          <div className="text-center p-12 border rounded-xl mt-4">
            <UserCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay clientes registrados</h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primer cliente con datos completos
            </p>
            <Button onClick={handleAddCustomer} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Agregar Primer Cliente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
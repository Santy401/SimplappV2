"use client";

import { DataTable } from "@simplapp/ui";
import { Button } from '@simplapp/ui';
import {
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Loading } from '@simplapp/ui'
import { useState, useEffect } from "react";
import { Bill } from "@domain/entities/Bill.entity";
import { useBillTable } from "@interfaces/src/hooks/features/Bills/useBillTable";
import { useBill } from "@interfaces/src/hooks/features/Bills/useBill";

interface BillsPageProps {
  onSelect?: (view: string) => void;
  onSelectBill?: (bill: Bill) => void;
}

export default function BillsPage({ onSelect = () => { }, onSelectBill = () => { } }: BillsPageProps) {
  // Ahora destructuramos 'bills' en lugar de 'bill'
  const { bills, loading, error, refetch } = useBill();
  const [tableversion, setTableversion] = useState(0);

  // bills ya es un array, así que solo necesitamos asegurarnos de que no sea null/undefined
  const validBills: Bill[] = bills ?? [];

  const refetchTable = () => {
    setTableversion((prev) => prev + 1);
  }

  const {
    columns,
    handleAddCustomer,
    handleExportCustomers
  } = useBillTable({ onSelect, onSelectBill, onDeleteSuccess: refetchTable });

  useEffect(() => {
    refetch();
  }, [tableversion]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error al cargar facturas</h3>
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
            <h1 className="text-3xl font-bold text-foreground">Facturas De Venta</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus facturas de venta
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
              className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Nueva Factura De Venta
            </Button>
          </div>
        </div>

        {validBills.length > 0 ? (
          <div className="rounded-xl overflow-hidden">
            <DataTable
              key={`bills-table-version-${tableversion}`}
              data={validBills}
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
            <h3 className="text-lg font-semibold mb-2">No hay facturas registradas</h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primera factura con datos completos
            </p>
            <Button onClick={handleAddCustomer} className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Agregar Primera Factura
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
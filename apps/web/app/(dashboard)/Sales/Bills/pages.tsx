"use client";

import { DataTable } from "@simplapp/ui";
import { Button } from "@simplapp/ui";
import { UserCheck, UserPlus } from "lucide-react";
import { DataTableSkeleton, Skeleton, PaymentModal } from "@simplapp/ui";
import { useState, useEffect } from "react";
import { Bill, BillDetail, BillStatus } from "@domain/entities/Bill.entity";
import { useBillTable } from "@interfaces/src/hooks/features/Bills/useBillTable";
import { useBill } from "@interfaces/src/hooks/features/Bills/useBill";
import { BillPreview } from "@ui/molecules/BillPreview";
import { toast } from "react-toastify";

interface BillsPageProps {
  onSelect?: (view: string) => void;
  onSelectBill?: (bill: BillDetail) => void;
}

export default function BillsPage({
  onSelect = () => { },
  onSelectBill = () => { },
}: BillsPageProps) {
  const { bills, isLoading, error, refetch, updateBill } = useBill();
  const [tableversion, setTableversion] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillDetail | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);

  const [deletingId, _setDeletingId] = useState<string | null>(null);

  const [localLoading, _setLocalLoading] = useState({
    export: false,
    delete: false,
    create: false,
    update: false,
    get: false,
  });


  const validBills: BillDetail[] = (bills as BillDetail[]) ?? [];

  const refetchTable = () => {
    setTableversion((prev) => prev + 1);
  };

  const {
    columns: originalColumns,
    handleAddCustomer,
    handleDeleteCustomer,
    handleDeleteManyCustomers,
    handleEditCustomer,
    handleExportCustomers,
  } = useBillTable({
    onSelect,
    onSelectBill,
    onDeleteSuccess: refetchTable,
    onOpenPaymentModal: (bill) => {
      setSelectedBillForPayment(bill);
      setIsPaymentModalOpen(true);
    }
  });

  const columns = originalColumns;

  const handlePaymentSubmit = async (paymentData: { value: string | number }) => {
    if (!selectedBillForPayment) return;

    // Convert strings to proper types
    const paymentValue = Number(paymentData.value) || 0;
    const currentBalance = Number(selectedBillForPayment.balance) || 0;
    const newBalance = currentBalance - paymentValue;

    if (newBalance < 0) {
      toast.error('El monto del pago no puede exceder el balance actual.');
      return;
    }

    try {
      const updated = await updateBill({
        ...selectedBillForPayment,
        balance: newBalance.toString(),
        status: newBalance <= 0 ? BillStatus.PAID : BillStatus.PARTIALLY_PAID,
        updatedAt: new Date(),
      });
      if (updated) {
        toast.success("Pago registrado correctamente");
        refetchTable();
      } else {
        toast.error("Error al registrar el pago");
      }
    } catch (_err) {
      toast.error("Error al registrar el pago");
    }
  };

  const handleViewBill = (bill: BillDetail) => {
    setSelectedBill(bill);
    setShowPreview(true);
  };

  useEffect(() => {
    refetch();
  }, [tableversion]);

  const preparePreviewData = (bill: BillDetail & { items?: any[] }) => {
    const items = bill.items || [];

    const formattedItems = items.map((item: any, index: number) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const taxRate = parseFloat(item.taxRate) || 0;
      return {
        id: item.id?.toString() || `item-${index}`,
        productId: item.productId,
        productName: item.productName,
        name: item.productName || item.name || "",
        reference: item.productCode || item.reference || "",
        price: price,
        quantity: quantity,
        discount: parseFloat(item.discount) || 0,
        taxRate: taxRate,
        taxAmount: (price * quantity * taxRate) / 100,
        description: item.description || "",
        total: parseFloat(item.total) || 0,
      };
    });

    return {
      formData: {
        date: bill.date
          ? new Date(bill.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        dueDate: bill.dueDate
          ? new Date(bill.dueDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        clientName: bill.clientName || "Cliente",
        clientId: bill.clientIdentification || "",
        email: bill.clientEmail || "",
        paymentMethod: bill.paymentMethod || "CASH",
        status: bill.status || "DRAFT",
        notes: bill.notes || "",
        billItems: (bill as any).items || [],
        footerNote: "",
        terms: "",
        logo: undefined,
        dianStatus: (bill as any).dianStatus,
        rejectedReason: (bill as any).rejectedReason,
        dianResponse: (bill as any).dianResponse,
      },
      items: formattedItems,
      subtotal: parseFloat(bill.subtotal || "0"),
      discountTotal: parseFloat(bill.discountTotal || "0"),
      taxTotal: parseFloat(bill.taxTotal || "0"),
      total: parseFloat(bill.total || "0"),
    };
  };

  if (isLoading.fetch && bills.length === 0) {
    return (
      <div className="min-h-fit w-full animate-in fade-in duration-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                <Skeleton className="h-9 w-64" />
              </h1>
              <div className="text-muted-foreground mt-2">
                <Skeleton className="h-5 w-52" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2 text-[15px] bg-input/55 py-2 px-2 rounded w-[90px] h-[38px] p-0 border-0"
                disabled
              >
                <Skeleton className="w-full h-full rounded" />
              </Button>
              <Button
                className="bg-foreground py-2 px-2 text-[14px] rounded-lg w-[200px] h-[38px] p-0 border-0"
                disabled
              >
                <Skeleton className="w-full h-full rounded-lg" />
              </Button>
            </div>
          </div>
          <DataTableSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md">
          <h3 className="text-lg font-semibold mb-2">
            Error al cargar facturas
          </h3>
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

  if (showPreview && selectedBill) {
    return (
      <div className="min-h-fit animate-in fade-in duration-500">
        <BillPreview
          {...preparePreviewData(selectedBill)}
          onClose={() => {
            setShowPreview(false);
            setSelectedBill(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-fit animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Facturas De Venta
            </h1>
            <div className="text-muted-foreground mt-2">
              Gestiona tus facturas de venta
            </div>
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
              <UserPlus className="w-4 h-4" />
              {localLoading.create ? "Creando..." : "Nueva Factura De Venta"}
            </Button>
          </div>
        </div>

        {validBills.length > 0 ? (
          <div className="rounded-xl overflow-hidden">
            <DataTable
              key={`bills-table-version-${tableversion}`}
              data={validBills}
              isBillView={true}
              actions={true}
              columns={columns}
              title=""
              searchable={true}
              pagination={true}
              itemsPerPage={10}
              onView={handleViewBill}
              onAdd={handleAddCustomer}
              onDelete={handleDeleteCustomer}
              onDeleteMany={handleDeleteManyCustomers}
              onEdit={handleEditCustomer}
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
          <div className="text-center p-12 border border-sidebar-border bg-white rounded-xl mt-4">
            <UserCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay facturas registradas
            </h3>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primera factura con datos completos
            </p>
            <Button
              onClick={handleAddCustomer}
              className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Agregar Primera Factura
            </Button>
          </div>
        )}
      </div>

      {selectedBillForPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setTimeout(() => setSelectedBillForPayment(null), 300);
          }}
          bill={selectedBillForPayment}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
}

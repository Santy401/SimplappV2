"use client";

import { ModernTable, useBillTable, ModernTableSkeleton, PaymentModal } from "@simplapp/ui";
import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bill, BillDetail } from "@domain/entities/Bill.entity";
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
  const router = useRouter();
  const { bills, isLoading, error, refetch, getBill } = useBill();
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

  const handlePaymentSubmit = async (paymentData: { value: string | number; date: string; bankAccount: string; paymentMethod: string; billId: string }) => {
    const targetBill = selectedBill || selectedBillForPayment;
    if (!targetBill) return;

    try {
      const response = await fetch(`/api/bills/${targetBill.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        toast.success("Pago registrado correctamente");
        refetch();
        
        if (showPreview && selectedBill) {
          const freshBill = await getBill(selectedBill.id);
          if (freshBill) setSelectedBill(freshBill);
        }
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          toast.error(errorData.error || "Error al registrar el pago");
        } else {
          toast.error(`Error ${response.status}: Error al registrar el pago`);
        }
      }
    } catch (_err) {
      toast.error("Error al registrar el pago");
    }
  };

  const handleDeletePayment = async (paymentId: string, billId: string) => {
    try {
      const response = await fetch(`/api/bills/${billId}/payments?paymentId=${paymentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Pago eliminado correctamente");
        refetch();
        
        if (selectedBill) {
          const freshBill = await getBill(selectedBill.id);
          if (freshBill) setSelectedBill(freshBill);
        }
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          toast.error(errorData.error || "Error al eliminar el pago");
        } else {
          toast.error(`Error ${response.status}: Error al eliminar el pago`);
        }
      }
    } catch (_err) {
      toast.error("Error al eliminar el pago");
    }
  };

  const handleCreateCreditNote = (billId: string) => {
    router.push(`/ventas/notas-credito/create?billId=${billId}`);
  };

  const handleViewBill = (bill: BillDetail) => {
    setSelectedBill(bill);
    setShowPreview(true);
  };

  // CLEAN: Eliminamos el useEffect que disparaba refetch() innecesarios al montar el componente
  // React Query se encarga de servir el caché instantáneamente.

  const preparePreviewData = (bill: BillDetail & { 
    items?: any[]; 
    dianStatus?: string | null;
    creditNotes?: any[];
    rejectedReason?: string | null;
    dianResponse?: string | null;
    payments?: any[]; 
  }) => {
    const items = bill.items || [];

    const formattedItems = items.map((item: any, index: number) => {
      const price = parseFloat(String(item.price || 0));
      const quantity = parseFloat(String(item.quantity || 0));
      const taxRate = parseFloat(String(item.taxRate || 0));
      return {
        id: item.id?.toString() || `item-${index}`,
        productId: item.productId,
        productName: item.productName || undefined,
        name: item.productName || item.name || "",
        reference: item.productCode || item.reference || "",
        price: price,
        quantity: quantity,
        discount: parseFloat(String(item.discount || 0)),
        taxRate: taxRate,
        taxAmount: (price * quantity * taxRate) / 100,
        description: item.description || "",
        total: parseFloat(String(item.total || 0)),
      };
    });

    const formattedPayments = (bill.payments || []).map((p: any) => ({
      id: p.id,
      date: p.date,
      receiptNumber: p.receiptNumber || (p.id ? p.id.substring(0, 8) : "---"),
      method: p.method,
      amount: p.amount,
      account: p.account ? { name: p.account.name } : null
    }));

    return {
      formData: {
        id: bill.id,
        number: bill.number,
        prefix: bill.prefix || "",
        date: bill.date
          ? new Date(bill.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        dueDate: bill.dueDate
          ? new Date(bill.dueDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        clientName: (bill.clientName?.trim() || bill.commercialName?.trim() || bill.client?.commercialName || bill.client?.firstName || bill.client?.firstLastName || "Cliente").trim(),
        commercialName: bill.commercialName || bill.client?.commercialName || "",
        clientId: bill.clientIdentification || "",
        email: bill.clientEmail || "",
        paymentMethod: bill.paymentMethod || "CASH",
        status: bill.status || "DRAFT",
        notes: bill.notes || "",
        billItems: bill.items || [],
        footerNote: "",
        terms: "",
        logo: undefined,
        dianStatus: bill.dianStatus || undefined,
        rejectedReason: bill.rejectedReason || undefined,
        dianResponse: bill.dianResponse || undefined,
      },
      items: formattedItems,
      payments: formattedPayments,
      subtotal: parseFloat(bill.subtotal || "0"),
      discountTotal: parseFloat(bill.discountTotal || "0"),
      taxTotal: parseFloat(bill.taxTotal || "0"),
      total: parseFloat(bill.total || "0"),
      creditNotes: (bill.creditNotes || []).map((cn: any) => ({
        id: cn.id,
        number: cn.number,
        prefix: cn.prefix,
        date: cn.date,
        type: cn.type,
        status: cn.status,
        total: Number(cn.total || 0),
      })),
    };
  };

  // Lógica de Skeleton Inteligente
  const isInitialLoading = isLoading.fetch && validBills.length === 0;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-8 text-center text-red-500">
        Error al cargar facturas. Por favor reintente.
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
          onAddPayment={handlePaymentSubmit}
          onCreateCreditNote={handleCreateCreditNote}
          onDeletePayment={handleDeletePayment}
        />
      </div>
    );
  }

  return (
    <div className="min-h-fit animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-2 py-8">
        {isInitialLoading ? (
          <div className="animate-in fade-in duration-200">
            <ModernTableSkeleton rowCount={5} columnCount={6} />
          </div>
        ) : (
          <ModernTable
            key={`bills-table-v-${tableversion}`}
            data={validBills}
            isBillView={true}
            actions={true}
            columns={originalColumns}
            title="Facturas de Venta"
            description="Gestiona y emite tus documentos electrónicos."
            onAdd={handleAddCustomer}
            addActionLabel="Nueva Factura"
            searchable={true}
            pagination={true}
            itemsPerPage={10}
            onView={handleViewBill}
            onDelete={handleDeleteCustomer}
            onDeleteMany={handleDeleteManyCustomers}
            onEdit={handleEditCustomer}
            onExport={handleExportCustomers}
            className="bg-transparent"
            emptyIcon={ReceiptText}
            emptyTitle="No hay facturas registradas"
            emptyDescription="Comienza agregando tu primera factura para llevar el control de tus ventas."
            emptyActionLabel="Crear mi primera factura"
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

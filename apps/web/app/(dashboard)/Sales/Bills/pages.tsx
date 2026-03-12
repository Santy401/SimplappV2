"use client";

import { ModernTable, useBillTable, ModernTableSkeleton, Skeleton, PaymentModal, Button } from "@simplapp/ui";
import { ReceiptText } from "lucide-react";
import { useState, useEffect } from "react";
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

  const columns = originalColumns;

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
        refetchTable();
        
        if (showPreview && selectedBill) {
          const freshBill = await getBill(selectedBill.id);
          if (freshBill) setSelectedBill(freshBill);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al registrar el pago");
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

  const preparePreviewData = (bill: BillDetail & { 
    items?: any[]; 
    dianStatus?: string | null;
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
    };
  };

  if (isLoading.fetch && bills.length === 0) {
    return (
      <div className="min-h-fit w-full animate-in fade-in duration-200">
        <div className="max-w-6xl mx-auto px-2 py-8">
          <ModernTableSkeleton rowCount={5} columnCount={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">
            Error al cargar facturas
          </h3>
          <p className="mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white h-10 px-6"
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
          onAddPayment={handlePaymentSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-fit animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-2 py-8">
        <ModernTable
          key={`bills-table-version-${tableversion}`}
          data={validBills}
          isBillView={true}
          actions={true}
          columns={columns}
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
          
          // --- Empty State Config ---
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

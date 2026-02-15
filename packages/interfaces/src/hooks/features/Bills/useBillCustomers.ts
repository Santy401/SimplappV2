import { useBill } from "./useBill";
import { Bill, BillDetail, BillStatus, UpdateBill } from "@domain/entities/Bill.entity";
import { BillsProps } from "@domain/entities/props/bills/Bills.entity.props";
import { toast } from "react-toastify";

export const useBillCustomers = ({
  onSelect,
  onSelectBill,
  onDeleteSuccess,
}: BillsProps) => {
  const { deleteBill, updateBill } = useBill();

  const toBillDetail = (bill: any): BillDetail => {
    return {
      ...bill,
      items: bill.items || [],
      date: bill.date || new Date(),
      dueDate: bill.dueDate || new Date(),
      subtotal: bill.subtotal || "0",
      taxTotal: bill.taxTotal || "0",
      discountTotal: bill.discountTotal || "0",
      total: bill.total || "0",
      balance: bill.balance || "0",
    } as BillDetail;
  };

  const handleEditCustomer = (bill: Bill | BillDetail | UpdateBill | any) => {
    if (onSelectBill) {
      const billDetail = toBillDetail(bill);
      onSelectBill(billDetail);
    }

    if (onSelect) {
      onSelect("ventas-facturacion-edit");
    }
  };

  const handleDeleteCustomer = async (bill: Bill) => {
    if (confirm(`¿Estás seguro de eliminar la factura ${bill.id}?`)) {
      const result = await deleteBill(bill.id);
      if (result) {
        toast.success("Factura eliminada");
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        toast.error("Error al eliminar factura");
      }
    }
  };

  const handleMarkAsPaid = async (bill: Bill | BillDetail | any) => {
    if (confirm(`¿Marcar la factura #${bill.number} como pagada?`)) {
      const billDetail = toBillDetail(bill);
      const updated = await updateBill({
        ...billDetail,
        status: BillStatus.PAID,
        balance: "0",
        updatedAt: new Date(),
      });
      if (updated) {
        toast.success("Factura marcada como pagada");
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        toast.error("Error al actualizar la factura");
      }
    }
  };

  const handleViewCustomer = (bill: Bill | BillDetail | any) => {
    console.log("Ver detalles de factura:", bill);

    if (onSelectBill) {
      const billDetail = toBillDetail(bill);
      onSelectBill(billDetail);
    }

    if (onSelect) {
      onSelect('ventas-facturacion-view');
    }
  };

  const handleAddCustomer = () => {
    console.log("Agregar nueva factura");

    if (onSelectBill) {
      onSelectBill(null as any);
    }

    if (onSelect) {
      onSelect("ventas-facturacion-create");
    }
  };

  const handleDeleteManyCustomers = async (bills: (Bill | BillDetail | any)[]) => {
    const results = await Promise.allSettled(
      bills.map((bill) => deleteBill(bill.id))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled" && r.value).length;
    const failed = results.length - succeeded;

    if (succeeded > 0) {
      toast.success(`${succeeded} factura(s) eliminada(s)`);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    }
    if (failed > 0) {
      toast.error(`Error al eliminar ${failed} factura(s)`);
    }
  };

  const handleExportCustomers = () => {
    console.log("Exportar facturas");
    // Logic
  };

  return {
    handleEditCustomer,
    handleDeleteCustomer,
    handleDeleteManyCustomers,
    handleViewCustomer,
    handleAddCustomer,
    handleExportCustomers,
    handleMarkAsPaid,
  };
};

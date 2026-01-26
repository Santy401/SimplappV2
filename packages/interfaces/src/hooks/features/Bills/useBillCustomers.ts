import { useBill } from "./useBill";
import { Bill, BillDetail, UpdateBill } from "@domain/entities/Bill.entity";
import { BillsProps } from "@domain/entities/props/bills/Bills.entity.props";
import { toast } from "react-toastify";

export const useBillCustomers = ({
  onSelect,
  onSelectBill,
  onDeleteSuccess,
}: BillsProps) => {
  const { deleteBill } = useBill();

  const toBillDetail = (bill: any): BillDetail => {
    return {
      ...bill,
      items: bill.items || [],
      // Asegurar otros campos requeridos
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

  const handleExportCustomers = () => {
    console.log("Exportar facturas");
    // Logic
  };

  return {
    handleEditCustomer,
    handleDeleteCustomer,
    handleViewCustomer,
    handleAddCustomer,
    handleExportCustomers,
  };
};

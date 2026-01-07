import { useBill } from "./useBill";
import { Bill } from "@domain/entities/Bill.entity";
import { BillsProps } from "@domain/entities/props/bills/Bills.entity.props";
import { toast } from "react-toastify";

export const useBillCustomers = ({ onSelect, onSelectBill, onDeleteSuccess }: BillsProps) => {
    const { deleteBill } = useBill();

    const handleEditCustomer = (bill: Bill) => {
        if (onSelectBill) {
            onSelectBill(bill);
        }

        if (onSelect) {
            onSelect('ventas-bills-create');
        }
    };

    const handleDeleteCustomer = async (bill: Bill) => {
        if (confirm(`¿Estás seguro de eliminar la factura ${bill.id}?`)) {
            const result = await deleteBill(bill.id);
            if (result) {
                toast.success('Factura eliminada');
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } else {
                toast.error('Error al eliminar factura');
            }
        }
    };

    const handleViewCustomer = (bill: Bill) => {
        console.log("Ver detalles de factura:", bill);
        if (onSelect) {
            onSelect('ventas-bills-view');
        }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nueva factura");
        if (onSelect) {
            onSelect('ventas-bills-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar facturas");
        // Logic
    };

    return { handleEditCustomer, handleDeleteCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers };
};
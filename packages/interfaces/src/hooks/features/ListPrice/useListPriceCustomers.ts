import { toast } from "sonner";
import { useListPrice } from "./useListPrice";
import { ListPriceProps } from "@domain/entities/props/listPrice/ListPrice.entity.props";
import { ListPrice } from "@domain/entities/ListPrice.entity";
import { useListPriceFullName } from "./useListPriceFullName";

export const useListPriceCustomers = ({ onSelect, onSelectListPrice, onDeleteSuccess }: ListPriceProps) => {
    const { deleteListPrice } = useListPrice();
    const { getFullName } = useListPriceFullName();

    const handleEditCustomer = (listPrice: ListPrice) => {
        if (onSelectListPrice) {
            onSelectListPrice(listPrice);
        }

        if (onSelect) {
            onSelect('inventario-precios-edit');
        }
    };

    const handleDeleteCustomer = async (listPrice: ListPrice) => {
        if (confirm(`¿Estás seguro de eliminar la lista de precios ${getFullName(listPrice)}?`)) {
            const result = await deleteListPrice(listPrice.id);
            if (result) {
                toast.success("Lista de precios eliminada");
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } else {
                toast.error("Error al eliminar lista de precios");
            }
        }
    };

    const handleViewCustomer = (listPrice: ListPrice) => {
        console.log("Ver detalles de cliente:", listPrice);
        if (onSelect) {
            onSelect('inventario-precios-view');
        }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo cliente");

        if (onSelectListPrice) {
            onSelectListPrice(null as any);
        }

        if (onSelect) {
            onSelect('inventario-precios-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar Precios");
        // Logic
    };

    return { handleEditCustomer, handleDeleteCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers }
}
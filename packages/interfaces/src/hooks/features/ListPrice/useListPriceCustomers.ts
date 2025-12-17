import { toast } from "sonner";
import { useListPrice } from "./useListPrice";
import { ListPriceProps } from "@domain/entities/props/listPrice/ListPrice.entity.props";
import { ListPrice } from "@domain/entities/ListPrice.entity";
import { useListPriceFullName } from "./useListPriceFullName";

export const useListPriceCustomers = ({ onSelect, onSelectListPrice }: ListPriceProps) => {
    const { deleteListPrice } = useListPrice();
    const { getFullName } = useListPriceFullName();

    const handleEditCustomer = (listPrice: ListPrice) => {
        if (onSelectListPrice) {
            onSelectListPrice(listPrice);
        }

        if (onSelect) {
            onSelect('ventas-precio-create');
        }
    };

    const handleDeleteCustomer = async (listPrice: ListPrice) => {
        if (confirm(`¿Estás seguro de eliminar a ${getFullName(listPrice)}?`)) {
            const result = await deleteListPrice(listPrice.id);
            if (result) {
                toast.success('Precio eliminado');
            } else {
                toast.error('Error al eliminar Precio');
            }
        }
    };

    const handleViewCustomer = (listPrice: ListPrice) => {
        console.log("Ver detalles de cliente:", listPrice);
        if (onSelect) {
            onSelect('ventas-precios-view');
        }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo cliente");
        if (onSelect) {
            onSelect('ventas-precios-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar Precios");
        // Logic
    };

    return { handleEditCustomer, handleDeleteCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers }
}
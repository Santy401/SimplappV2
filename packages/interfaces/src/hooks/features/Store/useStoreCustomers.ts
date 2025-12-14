import { toast } from "sonner";
import { useStore } from "./useStore";
import { StoresProps } from "@domain/entities/props/stores/Stores.entity.props";
import { Store } from "@domain/entities/Store.entity";
import { useStoreFullName } from "./useStoreFullName";

export const useStoreCustomers = ({ onSelect, onSelectStores }: StoresProps) => {
    const { deleteStore } = useStore();
    const { getFullName } = useStoreFullName();
    const handleEditCustomer = (store: Store) => {
        if (onSelectStores) {
            onSelectStores(store);
        }

        if (onSelect) {
            onSelect('ventas-bodega-create');
        }
    };

    const handleDeleteCustomer = async (store: Store) => {
        if (confirm(`¿Estás seguro de eliminar a ${getFullName(store)}?`)) {
            const result = await deleteStore(store.id.toString());
            if (result) {
                toast.success('Cliente eliminado');
            } else {
                toast.error('Error al eliminar cliente');
            }
        }
    };

    const handleViewCustomer = (store: Store) => {
        console.log("Ver detalles de Bodega:", store);
        // if (onSelect) {
        //     onSelect('ventas-store-view');
        // }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo Bodega");
        if (onSelect) {
            onSelect('ventas-bodega-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar Bodega");
        // Logic
    };

    return { handleEditCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers, handleDeleteCustomer }

}
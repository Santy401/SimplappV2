import { toast } from "sonner";
import { useStore } from "./useStore";
import { StoresProps } from "@domain/entities/props/stores/Stores.entity.props";
import { Store } from "@domain/entities/Store.entity";
import { useStoreFullName } from "./useStoreFullName";

export const useStoreCustomers = ({ onSelect, onSelectStores, onDeleteSuccess }: StoresProps) => {
    const { deleteStore } = useStore();
    const { getFullName } = useStoreFullName();
    const handleEditCustomer = (store: Store) => {
        if (onSelectStores) {
            onSelectStores(store);
        }

        if (onSelect) {
            onSelect('ventas-bodega-edit');
        }
    };

    const handleDeleteCustomer = async (store: Store) => {
        if (confirm(`¿Estás seguro de eliminar la bodega ${getFullName(store)}?`)) {
            const result = await deleteStore(store.id);
            if (result) {
                toast.success('Cliente eliminado');
                if (onDeleteSuccess) onDeleteSuccess();
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
        console.log("Agregar nueva Bodega");

        if (onSelectStores) {
            onSelectStores(null as any);
        }

        if (onSelect) {
            onSelect('ventas-bodega-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar Bodega");
        // Logic
    };

    const handleDeleteManyCustomers = async (stores: Store[]) => {
        const results = await Promise.allSettled(
            stores.map((store) => deleteStore(store.id))
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled' && r.value).length;
        const failed = results.length - succeeded;

        if (succeeded > 0) {
            toast.success(`${succeeded} bodega(s) eliminada(s)`);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        }

        if (failed > 0) {
            toast.error(`Error al eliminar ${failed} bodega(s)`);
        }
    };

    return { handleEditCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers, handleDeleteCustomer, handleDeleteManyCustomers }

}
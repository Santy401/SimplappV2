import { toast } from "sonner";
import { useStore } from "./useStore";
import { ClientesProps } from "@domain/entities/props/clients/Clientes.entity.props";
import { Store } from "@domain/entities/Store.entity";

export const useStoreCustomers = () => {
    // const { deleteClie} = useStore();

    const handleEditCustomer = (store: Store) => {
        // if (onSelect) {
        //     onSelectStore(store);
        // }

        // if (onSelect) {
        //     onSelect('ventas-store-create');
        // }
    };

    // const handleDeleteCustomer = async (client: Client) => {
    //     if (confirm(`¿Estás seguro de eliminar a ${getFullName(client)}?`)) {
    //         const result = await deleteClient(client.id);
    //         if (result) {
    //             toast.success('Cliente eliminado');
    //         } else {
    //             toast.error('Error al eliminar cliente');
    //         }
    //     }
    // };

    const handleViewCustomer = (store: Store) => {
        console.log("Ver detalles de Bodega:", store);
        // if (onSelect) {
        //     onSelect('ventas-store-view');
        // }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo Bodega");
        // if (onSelect) {
        //     onSelect('ventas-store-create');
        // }
    };

    const handleExportCustomers = () => {
        console.log("Exportar Bodega");
        // Logic
    };

    return { handleEditCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers }

}
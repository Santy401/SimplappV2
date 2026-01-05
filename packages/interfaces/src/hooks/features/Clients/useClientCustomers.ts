import { toast } from "sonner";
import { useClients } from "./useClient";
import { Client } from "@domain/entities/Client.entity";
import { useClientFullName } from "./useClientFullName";

import { ClientesProps } from "@domain/entities/props/clients/Clientes.entity.props";

export const useClientCustomers = ({ onSelect, onSelectClient, onDeleteSuccess }: ClientesProps) => {
    const { deleteClient } = useClients();
    const { getFullName } = useClientFullName();

    const handleEditCustomer = (client: Client) => {
        if (onSelectClient) {
            onSelectClient(client);
        }

        if (onSelect) {
            onSelect('ventas-clientes-edit');
        }
    };

    const handleDeleteCustomer = async (client: Client) => {
        if (confirm(`¿Estás seguro de eliminar a ${getFullName(client)}?`)) {
            const result = await deleteClient(client.id);
            if (result) {
                toast.success('Cliente eliminado');
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } else {
                toast.error('Error al eliminar cliente');
            }
        }
    };

    const handleViewCustomer = (client: Client) => {
        console.log("Ver detalles de cliente:", client);
        if (onSelect) {
            onSelect('ventas-clientes-view');
        }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo cliente");
        
        if (onSelectClient) {
            onSelectClient(null as any);
        }
        
        if (onSelect) {
            onSelect('ventas-clientes-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar clientes");
        // Logic
    };

    return { handleEditCustomer, handleDeleteCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers }

}
import { toast } from "sonner";
import { useSeller } from "./useSeller";
import { SellersProps } from "@domain/entities/props/sellers/Seller.entity.props";
import { Seller } from "@domain/entities/Seller.entity";
import { useSellerFullName } from "./useSellerFullName";

export const useSellerCustomers = ({ onSelect, onSelectSeller, onDeleteSuccess }: SellersProps) => {
    const { deleteSeller } = useSeller();
    useSellerFullName();
    const handleEditCustomer = (seller: Seller) => {
        if (onSelectSeller) {
            onSelectSeller(seller);
        }

        if (onSelect) {
            onSelect('ventas-vendedor-edit')
        }
    };

    const handleDeleteCustomer = async (seller: Seller) => {
        if (confirm(`¿Estas Seguro de eliminar a ${useSellerFullName(seller)}?`)) {
            const result = await deleteSeller(seller.id);
            if (result) {
                toast.success('Vendedor eliminado');
                if (onDeleteSuccess) onDeleteSuccess();
            } else {
                toast.error('Error al eliminar vendedor');
            }
        }
    };

    const handleViewCustomer = (seller: Seller) => {
        console.log("Ver detalles de vendedor:", seller);
        if (onSelect) {
            onSelect('ventas-seller-view');
        }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo Vendedor");

        if (onSelectSeller) {
            onSelectSeller(null as any);
        }

        if (onSelect) {
            onSelect('ventas-vendedor-create');
        }
    };

    const handleExportCustomers = () => {
        console.log("Exportar Vendedor");
        // Logic
    };

    const handleDeleteManyCustomers = async (sellers: Seller[]) => {
        const results = await Promise.allSettled(
            sellers.map((seller) => deleteSeller(seller.id))
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled' && r.value).length;
        const failed = results.length - succeeded;

        if (succeeded > 0) {
            toast.success(`${succeeded} vendedor(es) eliminado(s)`);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        }

        if (failed > 0) {
            toast.error(`Error al eliminar ${failed} vendedor(es)`);
        }
    };

    return { handleEditCustomer, handleViewCustomer, handleAddCustomer, handleExportCustomers, handleDeleteCustomer, handleDeleteManyCustomers }
}
import { toast } from "sonner";
import { Product } from "@domain/entities/Product.entity";
import { useProduct } from "./useProduct";
import { ProductsProps } from "@domain/entities/props/products/Product.entity.props";

export const useProductCustomers = ({ onSelect, onSelectProduct }: ProductsProps) => {
    const { deleteProduct } = useProduct();

    const handleEditCustomer = (product: Product) => {
        if (onSelectProduct) {
            onSelectProduct(product);
        }

        if (onSelect) {
            onSelect('ventas-productos-create');
        }
    };


    const handleDeleteCustomer = async (product: Product) => {
        if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
            const result = await deleteProduct(product.id!);
            if (result) {
                toast.success('Producto eliminado correctamente');
            } else {
                toast.error('Error al eliminar el producto');
            }
        }
    };

    const handleViewCustomer = (product: Product) => {
        console.log("Ver detalles del producto:", product);
        if (onSelect) {
            onSelect('productos-producto-view');
        }
        if (onSelectProduct) {
            onSelectProduct(product);
        }
    };

    const handleAddCustomer = () => {
        console.log("Agregar nuevo producto");
        if (onSelect) {
            onSelect('ventas-productos-create');
        }
    };


    const handleExportCustomers = () => {
        console.log("Exportar productos");
        toast.info('Función de exportación en desarrollo');
    };

    // const handleToggleStatus = async (product: Product) => {
    //     const newStatus = !product.active;
    //     const action = newStatus ? 'activar' : 'desactivar';

    //     if (confirm(`¿Estás seguro de ${action} el producto "${product.name}"?`)) {
    //         const updatedProduct = { ...product, active: newStatus };
    //         const result = await updateProduct(product.id!, updatedProduct);

    //         if (result) {
    //             toast.success(`Producto ${action}do correctamente`);
    //         } else {
    //             toast.error(`Error al ${action} el producto`);
    //         }
    //     }
    // };

    // const handleDuplicateProduct = (product: Product) => {
    //     console.log("Duplicar producto:", product);
    //     if (onSelectProduct) {
    //         onSelectProduct(product);
    //     }
    //     if (onSelect) {
    //         onSelect('productos-producto-duplicate');
    //     }
    // };

    // const handleUpdateInventory = (product: Product) => {
    //     console.log("Actualizar inventario para:", product);
    //     if (onSelectProduct) {
    //         onSelectProduct(product);
    //     }
    //     if (onSelect) {
    //         onSelect('productos-inventario-update');
    //     }
    // };


    return {
        handleEditCustomer,
        handleViewCustomer,
        handleAddCustomer,
        handleExportCustomers,
        handleDeleteCustomer,

        //POR ADÑADIR
        // handleToggleStatus,
        // handleDuplicateProduct,
        // handleUpdateInventory,
        // handleViewPriceHistory
    };
};
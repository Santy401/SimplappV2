"use client";

import { DataTable, Loading } from "@simplapp/ui";
import { Button } from '@simplapp/ui';
import {
    Package,
    ShoppingCart,
    DollarSign,
    Tag,
    Plus,
    Archive,
} from "lucide-react";
import { Product } from "@domain/entities/Product.entity";
import { useProduct } from "@interfaces/src/hooks/features/Products/useProduct";
import { useProductTable } from "@interfaces/src/hooks/index";
import { useEffect, useState } from "react";

interface ProductosProps {
    onSelect?: (view: string) => void;
    onSelectProduct?: (product: Product) => void;
}

export default function Productos({
    onSelect = () => { },
    onSelectProduct = () => { }
}: ProductosProps) {

    const { products, isLoading, error, refetch } = useProduct();


    const validProducts = (products || []).filter(p => p.id) as (Product & { id: string })[];

    const totalProducts = validProducts.length;
    const activeProducts = validProducts.filter(p => p.active).length;
    const inactiveProducts = validProducts.filter(p => !p.active).length;
    const totalValue = 0;

    const [tableversion, setTableversion] = useState(0);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [localLoading, setLocalLoading] = useState({
        export: false,
        delete: false,
        create: false,
        update: false,
        get: false,
    });

    const refetchTable = () => {
        setTableversion((prev) => prev + 1);
    };

    const {
        columns,
        handleAddCustomer,
        handleExportCustomers,
        handleDeleteManyCustomers,
    } = useProductTable({ onSelect, onSelectProduct, onDeleteSuccess: refetchTable });

    useEffect(() => {
        refetch();
    }, [tableversion]);


    if (isLoading.fetch && products.length === 0) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <div className="text-center">
                    <Loading />
                    {/* <p className="text-gray-600 ">Cargando clientes...</p> */}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Error al cargar clientes</h3>
                    <p className="mb-4">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-fit">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Productos De Venta</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona tu catálogo de productos y servicios
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleExportCustomers}
                            className="gap-2 text-[15px] bg-input/55 cursor-pointer py-2 px-2 rounded"
                        >
                            Exportar
                        </Button>
                        <Button
                            onClick={handleAddCustomer}
                            disabled={localLoading.create}
                            className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            {localLoading.create ? 'Creando...' : 'Nuevo Producto'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border border-sidebar-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Total</div>
                                <div className="text-2xl font-bold text-foreground">
                                    {totalProducts}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Package className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="border border-sidebar-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Activos</div>
                                <div className="text-2xl font-bold text-foreground">
                                    {activeProducts}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <ShoppingCart className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="border border-sidebar-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Inactivos</div>
                                <div className="text-2xl font-bold text-foreground">
                                    {inactiveProducts}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-orange-500/10">
                                <Archive className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </div>

                    {/* <div className="border border-sidebar-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Valor Total</div>
                                <div className="text-2xl font-bold text-foreground">
                                    ${totalValue.toFixed(2)}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <DollarSign className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div> */}
                </div>

                {validProducts.length > 0 ? (
                    <div className="rounded-xl overflow-hidden">
                        <DataTable
                            data={validProducts}
                            columns={columns}
                            title=""
                            searchable={true}
                            pagination={true}
                            itemsPerPage={10}
                            onAdd={handleAddCustomer}
                            onExport={handleExportCustomers}
                            className="bg-transparent"
                            onDeleteMany={handleDeleteManyCustomers}
                            isLoading={{
                                fetch: isLoading.fetch,
                                create: isLoading.create,
                                update: isLoading.update,
                                deleteId: deletingId,
                                deleteMany: false,
                                export: localLoading.export,
                                view: false,
                                rowId: deletingId,
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center p-12 border border-sidebar-border rounded-xl mt-4">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay productos registrados</h3>
                        <p className="text-muted-foreground mb-6">
                            Comienza agregando tu primer producto al catálogo
                        </p>
                        <Button onClick={handleAddCustomer} className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer">
                            <Plus className="w-4 h-4" />
                            Agregar Primer Producto
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
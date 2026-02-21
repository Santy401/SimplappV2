"use client";

import { ListPrice } from "@domain/entities/ListPrice.entity";
import { useListPrice } from "@interfaces/src/hooks/features/ListPrice/useListPrice";
import { useListPriceTable } from "@interfaces/src/hooks/features/ListPrice/useListPriceTable";
import { DataTable, Button, Loading } from "@simplapp/ui";
import { Tag, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ListPriceProps {
    onSelect?: (view: string) => void;
    onSelectListPrice?: (listPrice: ListPrice) => void;
}

export default function ListPrices({
    onSelect = () => { },
    onSelectListPrice = () => { }
}: ListPriceProps) {
    const { listPrices, isLoading: hookLoading, error, refrech, deleteListPrice } = useListPrice();
    const [tableversion, setTableversion] = useState(0);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [localLoading, setLocalLoading] = useState({
        export: false,
        create: false,
    });

    const refetchTable = () => {
        setTableversion((prev) => prev + 1);
    };

    const { columns, handleAddCustomer, handleExportCustomers, handleDeleteManyCustomers } = useListPriceTable({
        onSelect,
        onSelectListPrice,
        onDeleteSuccess: refetchTable
    });

    // ✅ HANDLE DELETE CORREGIDO - Recibe el ITEM completo, no solo el ID
    const handleDelete = async (item: ListPrice) => {
        // 1. Marcar para eliminar INMEDIATAMENTE (feedback visual)
        setDeletingId(item.id);

        // 2. Eliminar en segundo plano
        try {
            const success = await deleteListPrice(item.id);

            if (!success) {
                // Si falla, quitar el estado de eliminación
                setDeletingId(null);
                toast.error("Error al eliminar la lista de precios");
            } else {
                // Si éxito, la fila ya no está en data porque el hook actualizó listPrices
                toast.success("Lista de precios eliminada");
                // No necesitas refetchTable aquí porque el hook ya actualizó el estado
            }
        } catch (error) {
            setDeletingId(null);
            toast.error("Error al eliminar la lista de precios");
            console.error('Error:', error);
        }
    };

    const validListPrices = listPrices || [];

    useEffect(() => {
        refrech();
    }, [tableversion]);

    const handleExportWithLoading = async () => {
        setLocalLoading(prev => ({ ...prev, export: true }));
        await handleExportCustomers();
        setLocalLoading(prev => ({ ...prev, export: false }));
    };

    const handleAddWithLoading = () => {
        setLocalLoading(prev => ({ ...prev, create: true }));
        handleAddCustomer();
        // El create loading se reseteará cuando navegue a otra página
    };

    if (hookLoading.fetch && listPrices.length === 0) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <div className="text-center">
                    <Loading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Error al cargar listas de precios</h3>
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
                        <h1 className="text-3xl font-bold text-foreground">Listas de Precios</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona tus listas de precios y sus porcentajes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleExportWithLoading}
                            disabled={localLoading.export}
                            className="gap-2 text-[15px]"
                        >
                            {localLoading.export ? 'Exportando...' : 'Exportar'}
                        </Button>
                        <Button
                            onClick={handleAddWithLoading}
                            disabled={localLoading.create}
                            className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            {localLoading.create ? 'Creando...' : 'Nueva Lista de Precios'}
                        </Button>
                    </div>
                </div>

                {validListPrices.length > 0 ? (
                    <div className="rounded-xl overflow-hidden">
                        <DataTable
                            key={`list-prices-table-${tableversion}`}
                            data={validListPrices}
                            columns={columns}
                            title=""
                            searchable={true}
                            pagination={true}
                            itemsPerPage={10}
                            onAdd={handleAddCustomer}
                            onExport={handleExportCustomers}
                            onDelete={handleDelete}
                            onDeleteMany={handleDeleteManyCustomers}
                            className="bg-transparent"
                            isLoading={{
                                fetch: hookLoading.fetch,
                                create: hookLoading.create,
                                update: hookLoading.update,
                                deleteId: deletingId,
                                deleteMany: false,
                                export: localLoading.export,
                                view: false,
                                rowId: deletingId,
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center p-12 border border-sidebar-border bg-white rounded-xl mt-4">
                        <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay listas de precios registradas</h3>
                        <p className="text-muted-foreground mb-6">
                            Comienza agregando tu primera lista de precios
                        </p>
                        <Button
                            onClick={handleAddWithLoading}
                            disabled={localLoading.create}
                            className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            {localLoading.create ? 'Creando...' : 'Agrega Tu Primera Lista de Precios'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
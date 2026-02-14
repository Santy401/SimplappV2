"use client";

import { Seller } from "@domain/entities/Seller.entity";
import { useSeller } from "@interfaces/src/hooks/features/Sellers/useSeller";
import { useSellerTable } from "@interfaces/src/hooks/features/Sellers/useSellerTable";
import { DataTable, Button, Loading } from "@simplapp/ui";
import { Receipt, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface SellerProps {
    onSelect?: (view: string) => void;
    onSelectSeller?: (seller: Seller) => void;
}

export default function Sellers({
    onSelect = () => { },
    onSelectSeller = () => { }
}: SellerProps) {
    const { sellers, isLoading, error, refetch } = useSeller();
    const [ tableVersion, setTableVersion ] = useState(0);
    
    const refetchTable = () =>{
        setTableVersion(prev => prev + 1);
    }
    
    useEffect(() => {
        refetch();
    }, [tableVersion]);
    
    const { columns, handleAddCustomer } = useSellerTable({ onSelect, onSelectSeller, onDeleteSuccess: refetch });
    
    const ValidSellers = sellers || [];

    if (isLoading) {    
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
                        <h1 className="text-3xl font-bold text-foreground">Vendedores</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona tus Vendedores
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => { }}
                            className="gap-2 text-[15px]"
                        >
                            Exportar
                        </Button>
                        <Button
                            onClick={handleAddCustomer}
                            className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" />
                            Nuevo Vendedor
                        </Button>
                    </div>
                </div>

                {ValidSellers.length > 0 ? (
                    <div className="rounded-xl overflow-hidden">
                        <DataTable
                            data={ValidSellers}
                            columns={columns}
                            title=""
                            searchable={true}
                            pagination={true}
                            itemsPerPage={10}
                            onAdd={handleAddCustomer}
                            onExport={() => { }}
                            className="bg-transparent"
                        />
                    </div>
                ) : (
                    <div className="text-center p-12 border border-sidebar-border rounded-xl mt-4">
                        <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay Vendedores registrados</h3>
                        <p className="text-muted-foreground mb-6">
                            Comienza agregando tu primer Vendedor
                        </p>
                        <Button onClick={handleAddCustomer} className="bg-foreground hover:bg-foreground py-2 px-2 text-[14px] rounded-lg font-medium flex items-center justify-center gap-2 transition text-background m-auto cursor-pointer">
                            {/* <UserPlus className="w-4 h-4" /> */}
                            Agrega Tu Primer Vendedor
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
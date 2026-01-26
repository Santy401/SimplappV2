'use client';

import { Bill, BillDetail, CreateBillInput, UpdateBill } from "@domain/entities/Bill.entity";
import { FormBill } from "@ui/molecules/FormBill";
import { useClients } from "@hooks/features/Clients/useClient";
import { useProduct } from "@hooks/features/Products/useProduct";
import { useBill } from "@hooks/features/Bills/useBill";
import { toast } from "react-toastify";
import { BillPreview } from "@ui/molecules/BillPreview";
import { useState, useEffect } from 'react';

interface BillsCreatePageProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: BillDetail) => void;
    initialData?: Partial<BillDetail> & { id?: number };
    mode?: 'create' | 'edit' | 'view';
    isLoading?: boolean;
}

export default function BillsCreatePage({
    onSelect,
    onSelectBill,
    initialData,
    mode = 'create',
    isLoading = false,
}: BillsCreatePageProps) {
    
    // DEBUG: Verificar qué datos llegan
    console.log("🚀 BillsCreatePage render - mode:", mode);
    console.log("🚀 BillsCreatePage - initialData:", initialData);
    console.log("🚀 BillsCreatePage - initialData items:", (initialData as any)?.items);
    console.log("🚀 BillsCreatePage - initialData items count:", (initialData as any)?.items?.length || 0);
    
    const { clients, isLoading: clientsLoading } = useClients();
    const { products, isLoading: productsLoading } = useProduct();
    const { createBill, updateBill, loading: billLoading, getBill } = useBill();
    
    // Estado para la factura completa en modo view
    const [fullBill, setFullBill] = useState<Bill | null>(null);
    const [isFetchingBill, setIsFetchingBill] = useState(false);

    // Cargar factura completa cuando esté en modo view
    useEffect(() => {
        const loadFullBill = async () => {
            if (mode === 'view' && initialData?.id) {
                setIsFetchingBill(true);
                try {
                    const bill = await getBill(initialData.id);
                    if (bill) {
                        setFullBill(bill);
                    }
                } catch (error) {
                    console.error('Error loading bill:', error);
                    toast.error('Error al cargar la factura');
                } finally {
                    setIsFetchingBill(false);
                }
            }
        };

        loadFullBill();
    }, [mode, initialData?.id, getBill]);

    const handleSubmit = async (data: CreateBillInput) => {
        try {
            let result;

            if (mode === 'edit' && initialData?.id) {
                const billToUpdate: BillDetail  = {
                    id: initialData.id,
                    userId: data.userId,
                    clientId: data.clientId,
                    storeId: data.storeId,
                    companyId: data.companyId,
                    prefix: initialData.prefix || null,
                    number: initialData.number || 0,
                    legalNumber: initialData.legalNumber || null,
                    status: data.status!,
                    paymentMethod: data.paymentMethod!,
                    date: data.date || new Date(),
                    dueDate: data.dueDate,
                    subtotal: initialData.subtotal || '0',
                    taxTotal: initialData.taxTotal || '0',
                    discountTotal: initialData.discountTotal || '0',
                    total: initialData.total || '0',
                    balance: initialData.balance || '0',
                    notes: data.notes,
                    items: initialData.items || [],
                    createdAt: initialData.createdAt || new Date(),
                    updatedAt: new Date(),
                };
                result = await updateBill(billToUpdate);
                if (result) {
                    toast.success('Factura actualizada exitosamente');
                    onSelectBill?.(result);
                }
            } else if (mode === 'create') {
                result = await createBill(data);
                if (result) {
                    toast.success('Factura creada exitosamente');
                    onSelectBill?.(result);
                }
            }

            if (result) {
                onSelect?.('ventas-facturacion');
            }
        } catch (error) {
            console.error('Error al procesar factura:', error);
            toast.error('Error al procesar la factura');
        }
    };

    // Si estamos en modo view y tenemos la factura completa, mostrar preview
    if (mode === 'view') {
        // Usar initialData directamente (ya viene completa del backend)
        const billToShow = initialData;
        
        if (!billToShow) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-red-500">No hay datos de factura</p>
                        <button
                            onClick={() => onSelect?.('ventas-facturacion')}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            );
        }

        console.log('✅ Using initialData directly:', billToShow);
        
        // Preparar datos para BillPreview
        const previewData = {
            formData: {
                date: billToShow.date ? new Date(billToShow.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                dueDate: billToShow.dueDate ? new Date(billToShow.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                clientName: billToShow.clientName || 'Cliente',
                clientId: billToShow.clientIdentification || '',
                email: billToShow.clientEmail || '',
                paymentMethod: billToShow.paymentMethod!,
                status: billToShow.status!,
                notes: billToShow.notes || '',
                terms: '',
                footerNote: '',
                logo: undefined,
            },
            items: (billToShow as any).items || [], // Los items ya vienen en initialData
            subtotal: parseFloat(billToShow.subtotal || '0'),
            discountTotal: parseFloat(billToShow.discountTotal || '0'),
            taxTotal: parseFloat(billToShow.taxTotal || '0'),
            total: parseFloat(billToShow.total || '0'),
        };

        return (
            <BillPreview 
                {...previewData}
                onClose={() => onSelect?.('ventas-facturacion')}
            />
        );
    }

    return (
        <FormBill
            onSubmit={handleSubmit}
            onSelect={onSelect}
            onSelectBill={onSelectBill}
            initialData={initialData}
            mode={mode}
            isLoading={isLoading || clientsLoading || productsLoading || billLoading}
            clients={clients}
            products={products}
            userId={1}
            storeId={1}
            companyId={1}
        />
    );
}
'use client';

import { Bill, BillDetail, BillStatus, CreateBillInput, UpdateBill } from "@domain/entities/Bill.entity";
import { FormBill } from "@ui/molecules/FormBill";
import { useClients } from "@hooks/features/Clients/useClient";
import { useProduct } from "@hooks/features/Products/useProduct";
import { useStore } from "@interfaces/src/hooks/features/Stores/useStore";
import { useListPrice } from "@interfaces/src/hooks/features/ListPrice/useListPrice";
import { useSeller } from "@interfaces/src/hooks/features/Sellers/useSeller";
import { useBill } from "@hooks/features/Bills/useBill";
import { toast } from "react-toastify";
import { BillPreview } from "@ui/molecules/BillPreview";
import { useState, useEffect } from 'react';

interface BillsCreatePageProps {
    onSaveDraft?: (data: CreateBillInput) => Promise<void>;
    onEmitBill?: (data: CreateBillInput) => Promise<void>;
    onAutoSave?: (data: CreateBillInput) => Promise<string | undefined | null | void>;
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: BillDetail) => void;
    initialData?: Partial<BillDetail> & { id?: string };
    mode?: 'create' | 'edit' | 'view';
    isLoading?: boolean;
}

export default function BillsCreatePage({
    onSaveDraft,
    onEmitBill,
    onAutoSave,
    onSelect,
    onSelectBill,
    initialData,
    mode = 'create',
    isLoading = false,
}: BillsCreatePageProps) {
    const { clients, isLoading: clientsLoading } = useClients();
    const { products, isLoading: productsLoading } = useProduct();
    const { stores, isLoading: storesLoading } = useStore();
    const { listPrices, isLoading: listPricesLoading } = useListPrice();
    const { sellers, isLoading: sellersLoading } = useSeller();
    const { createBill, updateBill, loading: billLoading, getBill } = useBill();

    const [currentBillId, setCurrentBillId] = useState<string | undefined>(initialData?.id);

    // Update currentBillId if initialData changes (e.g. switching views)
    useEffect(() => {
        if (initialData?.id) setCurrentBillId(initialData.id);
    }, [initialData?.id]);

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

    const handleAutoSave = async (data: CreateBillInput) => {
        // Prevent auto-save if in view mode
        if (mode === 'view') return;

        try {
            if (currentBillId) {
                const billToUpdate: UpdateBill = {
                    id: currentBillId,
                    userId: data.userId,
                    clientId: data.clientId,
                    storeId: data.storeId,
                    listPriceId: data.listPriceId,
                    sellerId: data.sellerId,
                    companyId: data.companyId,
                    prefix: initialData?.prefix || null,
                    number: initialData?.number || 0,
                    legalNumber: initialData?.legalNumber || null,
                    status: data.status!,
                    paymentMethod: data.paymentMethod!,
                    date: data.date || new Date(),
                    dueDate: data.dueDate,
                    subtotal: data.subtotal || initialData?.subtotal || '0',
                    taxTotal: data.taxTotal || initialData?.taxTotal || '0',
                    discountTotal: data.discountTotal || initialData?.discountTotal || '0',
                    total: data.total || initialData?.total || '0',
                    balance: data.balance || initialData?.balance || '0',
                    notes: data.notes,
                    items: (data.items as any) || [],
                    createdAt: initialData?.createdAt || new Date(),
                    updatedAt: new Date(),
                };

                await updateBill(billToUpdate);
                console.log("Draft auto-saved", currentBillId);

            } else {
                // Create new bill
                const result = await createBill(data);
                if (result && result.id) {
                    setCurrentBillId(result.id);
                    console.log("Draft created via auto-save", result.id);
                }
            }
        } catch (error) {
            console.error('Error auto-saving draft:', error);
        }
    };

    const handleSubmit = async (data: CreateBillInput) => {
        try {
            let result;

            if (currentBillId) {
                const billToUpdate: UpdateBill = {
                    id: currentBillId,
                    userId: data.userId,
                    clientId: data.clientId,
                    storeId: data.storeId,
                    listPriceId: data.listPriceId,
                    sellerId: data.sellerId,
                    companyId: data.companyId,
                    prefix: initialData?.prefix || null,
                    number: initialData?.number || 0,
                    legalNumber: initialData?.legalNumber || null,
                    status: data.status!,
                    paymentMethod: data.paymentMethod!,
                    date: data.date || new Date(),
                    dueDate: data.dueDate,
                    subtotal: data.subtotal || '0',
                    taxTotal: data.taxTotal || '0',
                    discountTotal: data.discountTotal || '0',
                    total: data.total || '0',
                    balance: data.balance || '0',
                    notes: data.notes,
                    items: (initialData?.items as any) || [],
                    createdAt: initialData?.createdAt || new Date(),
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

    const handleSaveDraft = async (data: CreateBillInput) => {
        try {
            // Asegurar que el estado sea DRAFT
            const draftData = { ...data, status: BillStatus.DRAFT };

            if (currentBillId) {
                await updateBill({ ...draftData, id: currentBillId });
                toast.success('Borrador actualizado');
            } else {
                const result = await createBill(draftData);
                if (result?.id) {
                    setCurrentBillId(result.id);
                    toast.success('Borrador creado');
                }
            }
        } catch (error) {
            toast.error('Error al guardar borrador');
        }
    };

    const handleEmitBill = async (data: CreateBillInput) => {
        try {
            // Asegurar que el estado sea ISSUED
            const issuedData = { ...data, status: BillStatus.ISSUED };

            if (currentBillId) {
                await updateBill({ ...issuedData, id: currentBillId });
                toast.success('Factura actualizada y emitida');
            } else {
                const result = await createBill(issuedData);
                if (result?.id) {
                    setCurrentBillId(result.id);
                    toast.success('Factura emitida exitosamente');
                }
            }

            // Navegar de vuelta después de emitir
            onSelect?.('ventas-facturacion');
        } catch (error) {
            toast.error('Error al emitir factura');
        }
    };

    if (mode === 'view') {
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
            items: (billToShow as any).items || [],
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
            onSaveDraft={handleSaveDraft}
            onEmitBill={handleEmitBill}
            onSubmit={handleSubmit}
            onAutoSave={handleAutoSave}
            onSelect={onSelect}
            onSelectBill={onSelectBill}
            initialData={initialData}
            mode={mode}
            isLoading={isLoading || clientsLoading || productsLoading || billLoading || storesLoading || listPricesLoading || sellersLoading}
            clients={clients}
            products={products}
            stores={stores}
            listPrices={listPrices}
            sellers={sellers}
        />
    );
}
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Filter, Landmark } from 'lucide-react';
import { Button, ModernTable, ModernTableSkeleton } from '@simplapp/ui';
import type { TableColumn } from '@simplapp/ui/src/types/table.entity';
import { Skeleton, PaymentBillModal } from '@simplapp/ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useClients } from "@interfaces/src/hooks/index";
import { useBill } from "@interfaces/src/hooks/features/Bills/useBill";
import { toast } from 'react-toastify';

export default function ReceivedPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);

    const { clients } = useClients();
    const { bills, refetch: fetchBills } = useBill();

    const loadPayments = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/payments');
            if (res.ok) {
                const { data } = await res.json();
                setPayments(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadBankAccounts = async () => {
        try {
            const res = await fetch('/api/bank-accounts');
            if (res.ok) {
                const { data } = await res.json();
                setBankAccounts(data || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadPayments();
        loadBankAccounts();
        fetchBills();
    }, []);

    const formatMethod = (method: string) => {
        const methods: Record<string, string> = {
            CASH: 'Efectivo',
            TRANSFER: 'Transferencia bancaria',
            CREDIT_CARD: 'Tarjeta de crédito',
            OTHER: 'Otro método'
        };
        return methods[method] || method;
    };

    const columns: TableColumn<any>[] = [
        { key: 'receiptNumber', header: 'Número', cell: (item) => <span className="text-brand font-medium hover:underline">{item.receiptNumber || item.id.substring(0,8)}</span> },
        { key: 'clientName', header: 'Cliente', cell: (item) => <span className="font-medium text-slate-900 dark:text-slate-100">{item.bill?.clientName || '---'}</span> },
        { key: 'method', header: 'Detalles', cell: (item) => <span className="text-slate-500">{formatMethod(item.method)} {item.bill && `(Factura: ${item.bill.prefix||''}${item.bill.number})`}</span> },
        { key: 'createdAt', header: 'Creación', cell: (item) => <span className="text-slate-500">{format(new Date(item.date), "dd/MM/yyyy")}</span> },
        { key: 'accountName', header: 'Cuenta Bancaria', cell: (item) => <span className="text-slate-500">{item.account?.name || item.account?.bankName || 'No asociada'}</span> },
        { key: 'status', header: 'Estado', cell: () => <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400"><span className="w-1.5 h-1.5 rounded-full border border-slate-400"></span>No conciliado</span> },
        { key: 'amount', header: 'Monto', className: "text-right", cell: (item) => <span className="text-right font-medium">$ {Number(item.amount).toLocaleString('es-CO')}</span> },
    ];

    if (isModalOpen) {
        const mappedBankAccounts = bankAccounts.map(b => ({ id: String(b.id), name: b.bankName || b.name || '' }));
        const mappedClients = (clients || []).map((c: any) => {
            let name = 'Cliente sin nombre';
            if (c.commercialName && c.commercialName.trim() !== '') {
                name = c.commercialName;
            } else if (c.firstName || c.firstLastName) {
                name = `${c.firstName || ''} ${c.otherNames || ''} ${c.firstLastName || ''} ${c.secondLastName || ''}`.replace(/\s+/g, ' ').trim();
            } else if (c.name) {
                name = c.name;
            }
            return { id: String(c.id), name };
        });
        const mappedBills = (bills || [])
            .filter((b: any) => parseFloat(b.balance || '0') > 0 && b.status !== 'CANCELLED')
            .map((b: any) => ({
                id: String(b.id),
                number: b.number,
                clientId: String(b.clientId),
                balance: parseFloat(b.balance || '0'),
                dueDate: b.dueDate ? b.dueDate.toString() : undefined,
                total: parseFloat(b.total || '0')
            }));

        return (
            <PaymentBillModal
                companyName="Simplapp"
                bankAccounts={mappedBankAccounts}
                clients={mappedClients}
                bills={mappedBills}
                onClose={() => setIsModalOpen(false)}
                onSubmit={async (data) => {
                    try {
                        const loadingToast = toast.loading("Guardando pago...");
                        const response = await fetch('/api/payments', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            toast.update(loadingToast, { render: errorData.error || "Error al guardar el pago", type: "error", isLoading: false, autoClose: 3000 });
                            return;
                        }

                        toast.update(loadingToast, { render: "¡Pago guardado correctamente!", type: "success", isLoading: false, autoClose: 3000 });
                        setIsModalOpen(false);
                        
                        // Recargar todo fresco
                        await loadPayments();
                        await fetchBills();
                    } catch (error) {
                        toast.error("Ocurrió un error inesperado al conectar con el servidor.");
                        console.error('Error in POST:', error);
                    }
                }}
            />
        );
    }

    if (isLoading && payments.length === 0) {
        return (
            <div className="flex-1 p-6 max-w-6xl mx-auto w-full pb-20 overflow-y-auto animate-in fade-in duration-500">
                <ModernTableSkeleton rowCount={5} columnCount={7} />
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 max-w-6xl mx-auto w-full pb-20 overflow-y-auto animate-in fade-in duration-500">
            <ModernTable 
               data={payments}
               columns={columns}
               title="Pagos recibidos"
               description="Registra y organiza todos los pagos que recibes en tu empresa."
               addActionLabel="Nuevo pago recibido"
               onAdd={() => setIsModalOpen(true)}
               isLoading={isLoading}
               emptyIcon={Landmark}
               emptyTitle="No hay pagos registrados"
               emptyDescription="Registra los abonos y pagos que recibes para mantener tus cuentas al día."
               searchable={true}
               pagination={true}
            />
        </div>
    );
}

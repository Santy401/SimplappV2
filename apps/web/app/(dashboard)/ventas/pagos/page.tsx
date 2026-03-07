"use client";

import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Filter } from 'lucide-react';
import { Button } from '@simplapp/ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function ReceivedPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        loadPayments();
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

    return (
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full pb-20 overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-white">Pagos recibidos</h1>
                    <p className="text-slate-500 mt-2">Registra y organiza todos los pagos que recibes en tu empresa. <a href="#" className="text-emerald-500 hover:underline">Saber más</a></p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button className="bg-[#1fbc9c] hover:bg-teal-500 text-white shadow-sm border border-teal-600/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo pago recibido
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center">
                    <Button variant="outline" className="text-slate-600 bg-white">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar
                    </Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="p-4 font-medium w-10">
                                    <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                                </th>
                                <th className="p-4 font-medium">Número</th>
                                <th className="p-4 font-medium">Cliente</th>
                                <th className="p-4 font-medium">Detalles</th>
                                <th className="p-4 font-medium">Creación</th>
                                <th className="p-4 font-medium">Cuenta bancaria</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 font-medium text-right">Monto</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-slate-500">Cargando pagos...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-slate-500 border-dashed border-2 m-4 rounded-xl">No hay pagos registrados</td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                                        </td>
                                        <td className="p-4 font-medium text-emerald-600 hover:text-emerald-700">
                                            {payment.receiptNumber || payment.id.substring(0,8)}
                                        </td>
                                        <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                                            {payment.bill?.clientName || '---'}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {formatMethod(payment.method)} {payment.bill && `(Factura: ${payment.bill.prefix||''}${payment.bill.number})`}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {format(new Date(payment.date), "dd/MM/yyyy")}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {payment.account?.name || 'No asociada'}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full border border-slate-400"></span>
                                                No conciliado
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium">
                                            $ {Number(payment.amount).toLocaleString('es-CO')}
                                        </td>
                                        <td className="p-4">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building, Landmark, CreditCard, Wallet, Pencil, Trash2 } from 'lucide-react';
import { Button, InputField, SelectField } from '@simplapp/ui';
import { toast } from 'sonner';

// Replicating BankAccountType for client to avoid importing from prisma directly which throws errors sometimes
type BankAccountType = 'CASH' | 'BANK' | 'CREDIT_CARD' | 'OTHER';

interface BankAccount {
    id: string;
    name: string;
    type: BankAccountType;
    currency: string;
    description?: string;
}

export function BankAccountsSettings() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [type, setType] = useState<BankAccountType>('CASH');
    const [currency, setCurrency] = useState('COP');
    const [description, setDescription] = useState('');

    const accountTypes = [
        { value: 'CASH', label: 'Efectivo / Caja', icon: Wallet },
        { value: 'BANK', label: 'Cuenta Bancaria', icon: Landmark },
        { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito', icon: CreditCard },
        { value: 'OTHER', label: 'Otro', icon: Building },
    ];

    const loadAccounts = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/bank-accounts');
            if (res.ok) {
                const { data } = await res.json();
                setAccounts(data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar cuentas bancarias');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = { name, type, currency, description };
            const isEditing = !!editingAccount;
            const res = await fetch(isEditing ? `/api/bank-accounts/${editingAccount.id}` : '/api/bank-accounts', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success(isEditing ? 'Cuenta actualizada' : 'Cuenta creada correctamente');
                setIsFormOpen(false);
                setEditingAccount(null);
                resetForm();
                loadAccounts();
            } else {
                const { error } = await res.json();
                toast.error(error || 'Error al guardar cuenta');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error del servidor');
        }
    };

    const handleDelete = async () => {
        if (!isDeleting) return;
        try {
            const res = await fetch(`/api/bank-accounts/${isDeleting}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Cuenta eliminada');
                setIsDeleting(null);
                loadAccounts();
            } else {
                toast.error('Error al eliminar cuenta');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    const resetForm = () => {
        setName('');
        setType('CASH');
        setCurrency('COP');
        setDescription('');
    };

    const openEdit = (acc: BankAccount) => {
        setEditingAccount(acc);
        setName(acc.name);
        setType(acc.type);
        setCurrency(acc.currency);
        setDescription(acc.description || '');
        setIsFormOpen(true);
    };

    const renderIcon = (accType: string) => {
        const t = accountTypes.find(t => t.value === accType);
        const Icon = t?.icon || Building;
        return <Icon className="w-5 h-5 text-slate-500 mr-3" />;
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-medium">Cuentas Bancarias y Cajas</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Controla y gestiona los bancos y tesorería de tu empresa para asociar los pagos recibidos.
                    </p>
                </div>
                {!isFormOpen && (
                    <Button onClick={() => { resetForm(); setIsFormOpen(true); }} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 px-4 py-2">
                        <Plus size={16} />
                        Nueva Cuenta
                    </Button>
                )}
            </div>

            {isFormOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
                >
                    <h4 className="font-medium text-lg mb-4">{editingAccount ? 'Editar Cuenta' : 'Crear Nueva Cuenta'}</h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Nombre de la Cuenta *"
                                placeholder="Ej: Caja fuerte, Banco Principal"
                                value={name}
                                onChange={setName}
                                required
                            />
                            <SelectField
                                label="Tipo de Cuenta *"
                                value={type}
                                onChange={(val) => setType(val as BankAccountType)}
                                options={accountTypes.map(t => ({ value: t.value, label: t.label }))}
                            />
                            <InputField
                                label="Moneda"
                                value={currency}
                                onChange={setCurrency}
                            />
                            <InputField
                                label="Descripción / Nro de Cuenta"
                                placeholder="Opcional"
                                value={description}
                                onChange={setDescription}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setIsFormOpen(false); setEditingAccount(null); }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                {editingAccount ? 'Guardar Cambios' : 'Crear Cuenta'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {!isFormOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {isLoading ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-slate-500">
                            Cargando...
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                            <p className="text-slate-500 mb-4">No tienes cuentas configuradas aún.</p>
                            <Button onClick={() => { resetForm(); setIsFormOpen(true); }} variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">Crear mi primera cuenta</Button>
                        </div>
                    ) : (
                        accounts.map(account => (
                            <div key={account.id} className="p-5 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col hover:border-purple-300 dark:hover:border-purple-800 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg mr-3 shadow-inner">
                                            {renderIcon(account.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{account.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{accountTypes.find(t => t.value === account.type)?.label}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(account)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-md transition-colors">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => setIsDeleting(account.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-md transition-colors ml-1">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                    {account.description ? (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{account.description}</p>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Sin descripción</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isDeleting && (
                <div className="fixed inset-0 z-200 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleting(null)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white dark:bg-slate-950 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-slate-200 dark:border-slate-800"
                    >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Eliminar Cuenta</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            ¿Estás seguro de que deseas eliminar esta cuenta? Los pagos asociados podrían perder la referencia.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsDeleting(null)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Eliminar
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

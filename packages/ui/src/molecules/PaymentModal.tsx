"use client";

import React, { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "../atoms/Button/Button";
import { Input } from "../atoms/Input/Input";
import { Label } from "../atoms/Label/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../atoms/Select/Select";

export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: any;
    onSubmit: (payment: any) => void;
}

export function PaymentModal({ isOpen, onClose, bill, onSubmit }: PaymentModalProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        bankAccount: "caja_general",
        value: bill?.balance || "0",
        paymentMethod: "",
    });

    if (!isOpen || !bill) return null;

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            billId: bill.id,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-sidebar-border rounded-xl shadow-2xl sm:max-w-md w-full mx-4 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground opacity-70 transition-opacity"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-4 text-left pr-8">
                    <h2 className="text-xl font-semibold text-foreground">Nuevo pago</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Contacto:</span> {bill.clientName}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Número de venta:</span> {bill.number}</p>
                        <p className="text-sm text-foreground mt-2"><span className="font-semibold text-foreground mr-1">Valor por cobrar:</span> ${Number(bill.balance).toLocaleString("es-CO")}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                className="h-10"
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Cuenta bancaria</Label>
                            <Select value={formData.bankAccount} onValueChange={(v) => setFormData({ ...formData, bankAccount: v })}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="caja_general">Caja general</SelectItem>
                                    <SelectItem value="banco">Banco</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Valor</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    className="pl-7 h-10"
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Método de pago</Label>
                            <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4">
                    <Button variant="outline" className="flex items-center gap-2 h-10 font-medium">
                        <ArrowUpRight className="w-4 h-4" />
                        Ir al formulario avanzado
                    </Button>
                    <Button onClick={handleSubmit} className="bg-[#1fbc9c] hover:bg-teal-500 text-white h-10 px-6 font-medium border border-teal-600/20 shadow-sm">
                        Agregar pago
                    </Button>
                </div>
            </div>
        </div>
    );
}

"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { Label } from "../../atoms/Label/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../atoms/Select/Select";
export function PaymentModal({ isOpen, onClose, bill, onSubmit }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        bankAccount: "caja_general",
        value: bill?.balance || "0",
        paymentMethod: "",
    });
    const [accounts, setAccounts] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setIsLoadingAccounts(true);
            fetch('/api/bank-accounts')
                .then(res => res.json())
                .then(({ data }) => {
                setAccounts(data || []);
                if (data?.length > 0 && !formData.bankAccount) {
                    setFormData(prev => ({ ...prev, bankAccount: data[0].id }));
                }
            })
                .catch(err => console.error("Error fetching bank accounts:", err))
                .finally(() => setIsLoadingAccounts(false));
        }
    }, [isOpen]);
    if (!isOpen || !bill)
        return null;
    const handleSubmit = () => {
        onSubmit({ ...formData, bankAccount: formData.bankAccount === "none" ? "" : formData.bankAccount, billId: bill.id });
        onClose();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-9999 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-card border border-sidebar-border rounded-xl shadow-2xl sm:max-w-md w-full mx-4 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-muted-foreground hover:text-foreground opacity-70 transition-opacity", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("div", { className: "mb-4 text-left pr-8", children: _jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Nuevo pago" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("span", { className: "font-semibold text-foreground", children: "Contacto:" }), " ", bill.clientName] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("span", { className: "font-semibold text-foreground", children: "N\u00FAmero de venta:" }), " ", bill.number] }), _jsxs("p", { className: "text-sm text-foreground mt-2", children: [_jsx("span", { className: "font-semibold text-foreground mr-1", children: "Valor por cobrar:" }), "$", Number(bill.balance).toLocaleString("es-CO")] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Fecha" }), _jsx(Input, { type: "date", value: formData.date, className: "h-10", onChange: (e) => setFormData({ ...formData, date: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Cuenta bancaria" }), _jsxs(Select, { value: formData.bankAccount, onValueChange: (v) => setFormData({ ...formData, bankAccount: v }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: isLoadingAccounts ? "Cargando..." : "Seleccionar..." }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "none", children: "Sin cuenta" }), accounts.map(acc => _jsx(SelectItem, { value: acc.id, children: acc.name }, acc.id))] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Valor" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "$" }), _jsx(Input, { className: "pl-7 h-10", type: "number", value: formData.value, onChange: (e) => setFormData({ ...formData, value: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "M\u00E9todo de pago" }), _jsxs(Select, { value: formData.paymentMethod || "efectivo", onValueChange: (v) => setFormData({ ...formData, paymentMethod: v }), children: [_jsx(SelectTrigger, { className: "h-10", children: _jsx(SelectValue, { placeholder: "Seleccionar..." }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "efectivo", children: "Efectivo" }), _jsx(SelectItem, { value: "transferencia", children: "Transferencia" }), _jsx(SelectItem, { value: "tarjeta", children: "Tarjeta" })] })] })] })] })] }), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-4", children: [_jsxs(Button, { variant: "outline", className: "flex items-center gap-2 h-10 font-medium", children: [_jsx(ArrowUpRight, { className: "w-4 h-4" }), " Ir al formulario avanzado"] }), _jsx(Button, { onClick: handleSubmit, className: "h-10 px-6 font-medium", children: "Agregar pago" })] })] })] }));
}

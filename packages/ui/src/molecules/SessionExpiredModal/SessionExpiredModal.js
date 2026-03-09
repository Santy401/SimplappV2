"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../../atoms/Button/Button";
import { AlertTriangle } from "lucide-react";
export const SessionExpiredModal = ({ isOpen, onLogin }) => {
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-9999 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), _jsx("div", { className: "relative bg-card border border-sidebar-border rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-300", children: _jsxs("div", { className: "flex flex-col items-center text-center", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-red-600" }) }), _jsx("h2", { className: "text-2xl font-bold text-foreground mb-2", children: "Sesi\u00F3n Expirada" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Tu sesi\u00F3n ha expirado. Por favor, inicia sesi\u00F3n nuevamente para continuar." }), _jsx(Button, { onClick: onLogin, className: "w-full", children: "Iniciar Sesi\u00F3n" })] }) })] }));
};

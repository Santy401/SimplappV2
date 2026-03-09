'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../atoms/Button/Button';
import { ChevronDown, ChevronRight } from 'lucide-react';
export function FormModalLayout({ title, children, onSubmit, onCancel, onDelete, submitLabel = 'Guardar', cancelLabel = 'Cancelar', deleteLabel = 'Eliminar', showHeaderActions = true, showMoreOptions = false, moreOptionsOpen = false, onToggleMoreOptions, moreOptionsContent, isLoading = false, maxWidth = '5xl', className = '', }) {
    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
    }[maxWidth];
    return (_jsxs("div", { className: `min-h-fit ${className}`, children: [_jsx("div", { className: 'mt-3', children: _jsx("div", { className: `${maxWidthClass} mx-auto px-1 py-4`, children: _jsx("h1", { className: "text-3xl font-bold text-foreground mb-5", children: title }) }) }), _jsx("div", { className: `${maxWidthClass} mx-auto px-8 py-8`, children: _jsxs("form", { onSubmit: onSubmit, className: "space-y-8", children: [_jsx("div", { className: "border border-sidebar-border bg-white dark:bg-transparent rounded-lg p-6 space-y-6", children: children }), showMoreOptions && moreOptionsContent && (_jsxs("div", { className: "border border-sidebar-border bg-white dark:bg-transparent rounded-lg overflow-hidden", children: [_jsx("button", { type: "button", onClick: onToggleMoreOptions, className: "w-full flex items-center justify-between p-4 hover:bg-accent transition-colors", children: _jsxs("span", { className: "font-medium text-foreground flex items-center gap-2", children: [moreOptionsOpen ? (_jsx(ChevronDown, { className: "w-4 h-4" })) : (_jsx(ChevronRight, { className: "w-4 h-4" })), "M\u00E1s Opciones"] }) }), moreOptionsOpen && (_jsx("div", { className: "p-6 border-t border-border space-y-6", children: moreOptionsContent }))] })), _jsxs("div", { className: "flex justify-end gap-3", children: [onCancel && (_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, disabled: isLoading, children: cancelLabel })), onDelete && (_jsx(Button, { type: "button", variant: "destructive", onClick: onDelete, disabled: isLoading, children: deleteLabel })), onSubmit && (_jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? 'Guardando...' : submitLabel }))] })] }) })] }));
}

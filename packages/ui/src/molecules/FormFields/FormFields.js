'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from '../../atoms/Input/Input';
import { InputCurrency } from '../../atoms/InputCurrency/InputCurrency';
import { Label } from '../../atoms/Label/Label';
import { Textarea } from '../../atoms/Textarea/Textarea';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../../atoms/Select/Select';
export function InputField({ label, required = false, error, helpText, type = 'text', placeholder, value, onChange, disabled = false, readOnly = false, className = '', min, max, step }) {
    return (_jsxs("div", { className: `space-y-2 ${className}`, children: [_jsxs(Label, { htmlFor: label, children: [label, required && _jsx("span", { className: "text-destructive ml-1", children: "*" })] }), _jsx(Input, { id: label, type: type, value: value || '', onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: error ? 'border-destructive' : '', disabled: disabled, readOnly: readOnly, min: min, max: max, step: step }), error && _jsx("p", { className: "text-sm text-destructive", children: error }), helpText && !error && _jsx("p", { className: "text-sm text-muted-foreground", children: helpText })] }));
}
export function CurrencyField({ label, required = false, error, helpText, placeholder, value, onChange, disabled = false, readOnly = false, className = '' }) {
    return (_jsxs("div", { className: `space-y-2 ${className}`, children: [_jsxs(Label, { htmlFor: label, children: [label, required && _jsx("span", { className: "text-destructive ml-1", children: "*" })] }), _jsx(InputCurrency, { id: label, value: value || 0, onChange: onChange, placeholder: placeholder, className: error ? 'border-destructive' : '', disabled: disabled, readOnly: readOnly }), error && _jsx("p", { className: "text-sm text-destructive", children: error }), helpText && !error && _jsx("p", { className: "text-sm text-muted-foreground", children: helpText })] }));
}
export function TextareaField({ label, required = false, error, helpText, placeholder, value, onChange, rows = 4, disabled = false, readOnly = false, className = '' }) {
    return (_jsxs("div", { className: `space-y-2 ${className}`, children: [_jsxs(Label, { htmlFor: label, children: [label, required && _jsx("span", { className: "text-destructive ml-1", children: "*" })] }), _jsx(Textarea, { id: label, value: value || '', onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: `resize-none ${error ? 'border-destructive' : ''}`, rows: rows, disabled: disabled, readOnly: readOnly }), error && _jsx("p", { className: "text-sm text-destructive", children: error }), helpText && !error && _jsx("p", { className: "text-sm text-muted-foreground", children: helpText })] }));
}
export function SelectField({ label, required = false, error, helpText, value, onChange, options, placeholder = 'Seleccione una opción', disabled = false, className = '' }) {
    return (_jsxs("div", { className: `space-y-2 ${className}`, children: [_jsxs(Label, { htmlFor: label, children: [label, required && _jsx("span", { className: "text-destructive ml-1", children: "*" })] }), _jsxs(Select, { value: value, onValueChange: onChange, disabled: disabled, children: [_jsx(SelectTrigger, { id: label, className: error ? 'border-destructive' : '', children: _jsx(SelectValue, { placeholder: placeholder }) }), _jsx(SelectContent, { children: options.map((o) => _jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })] }), error && _jsx("p", { className: "text-sm text-destructive", children: error }), helpText && !error && _jsx("p", { className: "text-sm text-muted-foreground", children: helpText })] }));
}
export function CheckboxField({ label, error, helpText, checked, onChange, disabled = false, className = '' }) {
    return (_jsxs("div", { className: `flex items-center space-x-2 ${className}`, children: [_jsx(Checkbox, { id: label, checked: checked, onCheckedChange: (c) => onChange(c), disabled: disabled }), _jsx(Label, { htmlFor: label, className: "cursor-pointer", children: label }), error && _jsx("p", { className: "text-sm text-destructive", children: error }), helpText && !error && _jsx("p", { className: "text-sm text-muted-foreground", children: helpText })] }));
}

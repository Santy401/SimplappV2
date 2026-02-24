"use client";

import * as React from "react";
import { Input } from "../Input/Input";

interface InputCurrencyProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
    value: number;
    onChange: (value: number) => void;
    locale?: string;
    currency?: string;
}

export const InputCurrency = React.forwardRef<HTMLInputElement, InputCurrencyProps>(
    ({
        value,
        onChange,
        locale = "es-CO",
        currency = "COP",
        ...props
    }, ref) => {
        const [displayValue, setDisplayValue] = React.useState("");
        const internalRef = React.useRef<HTMLInputElement>(null);

        // Combine external ref with internal ref
        React.useImperativeHandle(ref, () => internalRef.current!);

        // Format number to currency string without symbol for the input display
        const format = (val: number) => {
            return new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(val);
        };

        // On mount and when value changes from outside, update display
        React.useEffect(() => {
            if (document.activeElement !== internalRef.current) {
                setDisplayValue(format(value));
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;

            // Remove everything except numbers and the decimal separator for the locale
            // In es-CO, decimal is comma. We want to support dots too.
            // Allow only one decimal separator (either comma or dot)
            let cleanValue = rawValue.replace(/[^\d,.]/g, ""); // Remove non-numeric, non-comma, non-dot characters

            // Ensure only one decimal separator
            const parts = cleanValue.split(/[,.]/);
            if (parts.length > 2) {
                // If more than one decimal separator, keep the first part and the first decimal part
                cleanValue = parts[0] + '.' + parts.slice(1, 2).join('');
            } else if (parts.length === 2) {
                // If there's one decimal separator, normalize it to a dot
                cleanValue = parts[0] + '.' + parts[1];
            } else {
                // No decimal separator, just digits
                cleanValue = parts[0];
            }

            setDisplayValue(cleanValue);

            const numValue = parseFloat(cleanValue); // parseFloat can handle the dot as decimal
            if (!isNaN(numValue)) {
                onChange(numValue);
            } else if (cleanValue === "" || cleanValue === ".") { // Also handle just a decimal point
                onChange(0);
            }
        };

        const handleBlur = () => {
            setDisplayValue(format(value));
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            // Show raw number for easier editing
            setDisplayValue(value === 0 ? "" : value.toString());
            // Select all text
            setTimeout(() => e.target.select(), 0);
        };

        return (
            <Input
                {...props}
                ref={internalRef}
                type="text"
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
        );
    });

InputCurrency.displayName = "InputCurrency";

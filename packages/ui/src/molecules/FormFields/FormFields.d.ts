interface BaseFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    helpText?: string;
    className?: string;
}
interface InputFieldProps extends BaseFieldProps {
    type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'date';
    placeholder?: string;
    value: string | number;
    onChange: (value: string) => void;
    disabled?: boolean;
    readOnly?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
}
export declare function InputField({ label, required, error, helpText, type, placeholder, value, onChange, disabled, readOnly, className, min, max, step }: InputFieldProps): import("react/jsx-runtime").JSX.Element;
interface CurrencyFieldProps extends BaseFieldProps {
    placeholder?: string;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    readOnly?: boolean;
}
export declare function CurrencyField({ label, required, error, helpText, placeholder, value, onChange, disabled, readOnly, className }: CurrencyFieldProps): import("react/jsx-runtime").JSX.Element;
interface TextareaFieldProps extends BaseFieldProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    disabled?: boolean;
    readOnly?: boolean;
}
export declare function TextareaField({ label, required, error, helpText, placeholder, value, onChange, rows, disabled, readOnly, className }: TextareaFieldProps): import("react/jsx-runtime").JSX.Element;
interface SelectFieldProps extends BaseFieldProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{
        value: string;
        label: string;
    }>;
    placeholder?: string;
    disabled?: boolean;
}
export declare function SelectField({ label, required, error, helpText, value, onChange, options, placeholder, disabled, className }: SelectFieldProps): import("react/jsx-runtime").JSX.Element;
interface CheckboxFieldProps extends BaseFieldProps {
    checked: boolean | undefined;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}
export declare function CheckboxField({ label, error, helpText, checked, onChange, disabled, className }: CheckboxFieldProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FormFields.d.ts.map
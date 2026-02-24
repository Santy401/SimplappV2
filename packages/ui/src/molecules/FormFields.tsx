'use client';

import { ReactNode } from 'react';
import { Input } from '../atoms/Input/Input';
import { InputCurrency } from '../atoms/InputCurrency/InputCurrency';
import { Label } from '../atoms/Label/Label';
import { Textarea } from '../atoms/Textarea/Textarea';
import { Checkbox } from '../atoms/Checkbox/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../atoms/Select/Select';

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

export function InputField({
  label,
  required = false,
  error,
  helpText,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className = '',
  min,
  max,
  step,
}: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={label}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'border-destructive' : ''}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

interface CurrencyFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function CurrencyField({
  label,
  required = false,
  error,
  helpText,
  placeholder,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className = '',
}: CurrencyFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <InputCurrency
        id={label}
        value={value || 0}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'border-destructive' : ''}
        disabled={disabled}
        readOnly={readOnly}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export function TextareaField({
  label,
  required = false,
  error,
  helpText,
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled = false,
  readOnly = false,
  className = '',
}: TextareaFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`resize-none ${error ? 'border-destructive' : ''}`}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  label,
  required = false,
  error,
  helpText,
  value,
  onChange,
  options,
  placeholder = 'Seleccione una opción',
  disabled = false,
  className = '',
}: SelectFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={label} className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxField({
  label,
  error,
  helpText,
  checked,
  onChange,
  disabled = false,
  className = '',
}: CheckboxFieldProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Checkbox
        id={label}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        disabled={disabled}
      />
      <Label htmlFor={label} className="cursor-pointer">
        {label}
      </Label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
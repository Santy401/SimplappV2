'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { X, ArrowUpRight, ChevronDown, Loader2 } from 'lucide-react';

// ─── Field types ──────────────────────────────────────────────────────────────

export type QuickFieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'date';

export interface QuickFieldOption { label: string; value: string; }

export interface QuickField {
  key: string;
  label: string;
  type: QuickFieldType;
  placeholder?: string;
  required?: boolean;
  options?: QuickFieldOption[];   // solo para type === 'select'
  defaultValue?: string;
  colSpan?: 1 | 2;                // 1 = mitad, 2 = full (en grid de 2 cols)
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface QuickCreateModalProps {
  /** Mostrar u ocultar el modal */
  open: boolean;
  /** Cierra el modal */
  onClose: () => void;
  /** Título del modal — ej: "Nuevo cliente" */
  title: string;
  /** Ícono opcional (componente Lucide) */
  icon?: React.ElementType;
  /** Descripción breve bajo el título */
  description?: string;
  /** Configuración de campos */
  fields: QuickField[];
  /** Valores actuales del formulario */
  values: Record<string, string>;
  /** Callback de cambio de campo */
  onChange: (key: string, value: string) => void;
  /** Callback de submit */
  onSubmit: (values: Record<string, string>) => void;
  /** Label del botón de submit */
  submitLabel?: string;
  /** Label del botón de formulario avanzado */
  advancedLabel?: string;
  /** Callback al pulsar "Ir a formulario avanzado" */
  onAdvanced?: () => void;
  /** Estado de carga */
  isLoading?: boolean;
  /** Ancho del modal */
  width?: 'sm' | 'md' | 'lg';
  /** Posición de anclaje */
  anchor?: 'center' | 'bottom-right' | 'bottom-left';
  /** Nodo extra debajo de los campos (slots opcionales) */
  extra?: ReactNode;
}

// ─── Width map ────────────────────────────────────────────────────────────────

const widthMap = { sm: 'w-80', md: 'w-96', lg: 'w-[28rem]' };

// ─── Atoms ────────────────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
      {children}
      {required && <span className="ml-1 text-[#6C47FF] font-bold">*</span>}
    </label>
  );
}

const StyledInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
          focus:border-[#6C47FF] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      />
    );
  }
);
StyledInput.displayName = 'StyledInput';

function StyledSelect({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30 focus:border-[#6C47FF]
          appearance-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

function StyledTextarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
        focus:border-[#6C47FF] transition-all resize-none disabled:opacity-60 ${className}`}
    />
  );
}

// ─── Anchor position classes ──────────────────────────────────────────────────

const anchorMap = {
  center:       'fixed inset-0 flex items-center justify-center z-50',
  'bottom-right': 'fixed bottom-6 right-6 z-50 flex items-end justify-end',
  'bottom-left':  'fixed bottom-6 left-6 z-50 flex items-end justify-start',
};

// ─── Main component ───────────────────────────────────────────────────────────

export function QuickCreateModal({
  open,
  onClose,
  title,
  icon: Icon,
  description,
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel = 'Crear',
  advancedLabel = 'Ir a formulario avanzado',
  onAdvanced,
  isLoading = false,
  width = 'md',
  anchor = 'center',
  extra,
}: QuickCreateModalProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Foco automático al abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isCenter = anchor === 'center';

  return (
    <>
      {/* Backdrop — solo en modo center */}
      {isCenter && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={onClose}
        />
      )}

      {/* Modal container */}
      <div className={anchorMap[anchor]}>
        <div
          className={`
            ${widthMap[width]}
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
            flex flex-col overflow-hidden
            animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200
          `}
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Header ── */}
          <div className="px-5 py-4 flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-[#6C47FF]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#6C47FF]" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  {title}
                </p>
                {description && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── Form body ── */}
          <form onSubmit={handleSubmit}>
            <div className="px-5 py-4 space-y-3.5">

              {/* Fields grid */}
              <div className="grid grid-cols-2 gap-3">
                {fields.map((field, idx) => (
                  <div
                    key={field.key}
                    className={field.colSpan === 2 || fields.length === 1 ? 'col-span-2' : 'col-span-1'}
                  >
                    <FieldLabel required={field.required}>{field.label}</FieldLabel>

                    {field.type === 'textarea' ? (
                      <StyledTextarea
                        placeholder={field.placeholder}
                        value={values[field.key] ?? field.defaultValue ?? ''}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        rows={3}
                        disabled={isLoading}
                      />
                    ) : field.type === 'select' ? (
                      <StyledSelect
                        value={values[field.key] ?? field.defaultValue ?? ''}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="">Seleccionar...</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </StyledSelect>
                    ) : (
                      <StyledInput
                        ref={idx === 0 ? firstInputRef : undefined}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={values[field.key] ?? field.defaultValue ?? ''}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        disabled={isLoading}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Extra slot */}
              {extra && <div>{extra}</div>}

            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-3">

              {/* Formulario avanzado */}
              {onAdvanced && (
                <button
                  type="button"
                  onClick={onAdvanced}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#6C47FF] hover:text-[#5835E8] transition-colors disabled:opacity-50 group"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {advancedLabel}
                </button>
              )}

              {/* Si no hay botón avanzado, empujar acciones a la derecha */}
              {!onAdvanced && <span />}

              {/* Submit */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-8 px-4 rounded-lg text-xs font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creando...</>
                    : submitLabel
                  }
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </>
  );
}
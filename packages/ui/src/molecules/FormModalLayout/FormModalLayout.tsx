'use client';

import { ReactNode } from 'react';
import { ChevronDown, ChevronRight, ArrowLeft, Save, Trash2, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormModalLayoutProps {
  title: string;
  icon?: React.ElementType;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;
  showMoreOptions?: boolean;
  moreOptionsOpen?: boolean;
  onToggleMoreOptions?: () => void;
  moreOptionsContent?: ReactNode;
  isLoading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  className?: string;
}

const maxWidthMap = {
  sm:  'max-w-sm',
  md:  'max-w-md',
  lg:  'max-w-lg',
  xl:  'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FormModalLayout({
  title,
  icon: Icon,
  children,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  deleteLabel = 'Eliminar',
  showMoreOptions = false,
  moreOptionsOpen = false,
  onToggleMoreOptions,
  moreOptionsContent,
  isLoading = false,
  maxWidth = '5xl',
  className = '',
}: FormModalLayoutProps) {
  const mw = maxWidthMap[maxWidth];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${className}`}>

      {/* ── Sticky navbar ── */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className={`${mw} mx-auto px-6 h-14 flex items-center justify-between gap-4`}>

          {/* Left: back + title */}
          <div className="flex items-center gap-3">
            {onCancel && (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              </>
            )}
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon className="w-4 h-4 text-[#6C47FF]" />
              )}
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {title}
              </span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {cancelLabel}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="h-8 px-3 rounded-lg text-sm font-medium text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleteLabel}
              </button>
            )}
            {onSubmit && (
              <button
                form="form-modal-layout"
                type="submit"
                disabled={isLoading}
                className="h-8 px-4 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="w-3.5 h-3.5" />
                {isLoading ? 'Guardando...' : submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className={`${mw} mx-auto px-6 py-8`}>
        <form id="form-modal-layout" onSubmit={onSubmit} className="space-y-5">

          {/* Main content card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            {children}
          </div>

          {/* More options accordion */}
          {showMoreOptions && moreOptionsContent && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={onToggleMoreOptions}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
                    {moreOptionsOpen
                      ? <ChevronDown className="w-3.5 h-3.5 text-[#6C47FF]" />
                      : <ChevronRight className="w-3.5 h-3.5 text-[#6C47FF]" />
                    }
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Más opciones
                  </span>
                </div>
              </button>

              {moreOptionsOpen && (
                <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  {moreOptionsContent}
                </div>
              )}
            </div>
          )}

          {/* Bottom action row */}
          <div className="flex items-center justify-between py-2">
            <p className="text-xs text-slate-400">
              Los campos con <span className="text-[#6C47FF] font-bold">*</span> son obligatorios
            </p>
            <div className="flex items-center gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  {cancelLabel}
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isLoading}
                  className="h-9 px-4 rounded-lg text-sm font-medium text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteLabel}
                </button>
              )}
              {onSubmit && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-9 px-5 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-2 shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Guardando...' : submitLabel}
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
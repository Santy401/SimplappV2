'use client';

import { ReactNode } from 'react';
import { Button } from '@simplapp/ui';
import { Printer, Paperclip, History, ChevronDown, ChevronRight } from 'lucide-react';

interface FormModalLayoutProps {
  title: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;
  showHeaderActions?: boolean;
  showMoreOptions?: boolean;
  moreOptionsOpen?: boolean;
  onToggleMoreOptions?: () => void;
  moreOptionsContent?: ReactNode;
  isLoading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  className?: string;
}

export function FormModalLayout({
  title,
  children,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  deleteLabel = 'Eliminar',
  showHeaderActions = true,
  showMoreOptions = false,
  moreOptionsOpen = false,
  onToggleMoreOptions,
  moreOptionsContent,
  isLoading = false,
  maxWidth = '5xl',
  className = '',
}: FormModalLayoutProps) {
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

  return (
    <div className={`min-h-screen ${className}`}>
      <div className='mt-3'>
        <div className={`${maxWidthClass} mx-auto px-1 py-4`}>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {showHeaderActions && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Adjuntar
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <History className="w-4 h-4 mr-2" />
                  Ver Historial
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${maxWidthClass} mx-auto px-8 py-8`}>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="border border-sidebar-border rounded-lg p-6 space-y-6">
            {children}
          </div>

          {showMoreOptions && moreOptionsContent && (
            <div className="border border-sidebar-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={onToggleMoreOptions}
                className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
              >
                <span className="font-medium text-foreground flex items-center gap-2">
                  {moreOptionsOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Más Opciones
                </span>
              </button>

              {moreOptionsOpen && (
                <div className="p-6 border-t border-border space-y-6">
                  {moreOptionsContent}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
              >
                {deleteLabel}
              </Button>
            )}
            {onSubmit && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : submitLabel}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
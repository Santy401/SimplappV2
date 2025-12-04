import { ReactNode } from 'react';

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function FormSection({
  children,
  title,
  description,
  columns = 2,
  gap = 'md',
  className = '',
}: FormSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  }[gap];

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-2">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className={`grid ${gridCols} ${gapClass}`}>
        {children}
      </div>
    </div>
  );
}
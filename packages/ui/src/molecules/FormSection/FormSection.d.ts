import { ReactNode } from 'react';
interface FormSectionProps {
    children: ReactNode;
    title?: string;
    description?: string;
    columns?: 1 | 2 | 3 | 4;
    gap?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
}
export declare function FormSection({ children, title, description, columns, gap, className, }: FormSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FormSection.d.ts.map
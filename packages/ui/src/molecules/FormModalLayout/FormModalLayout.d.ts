import { ReactNode } from 'react';
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
export declare function FormModalLayout({ title, children, onSubmit, onCancel, onDelete, submitLabel, cancelLabel, deleteLabel, showHeaderActions, showMoreOptions, moreOptionsOpen, onToggleMoreOptions, moreOptionsContent, isLoading, maxWidth, className, }: FormModalLayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FormModalLayout.d.ts.map
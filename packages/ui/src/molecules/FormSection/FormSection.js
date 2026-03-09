import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function FormSection({ children, title, description, columns = 2, gap = 'md', className = '', }) {
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
    return (_jsxs("div", { className: `space-y-4 ${className}`, children: [(title || description) && (_jsxs("div", { className: "space-y-2", children: [title && _jsx("h3", { className: "text-lg font-semibold", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground", children: description }))] })), _jsx("div", { className: `grid ${gridCols} ${gapClass}`, children: children })] }));
}

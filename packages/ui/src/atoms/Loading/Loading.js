import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function FullScreenLoading() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: _jsxs("div", { className: "relative h-16 w-16", children: [_jsx("div", { className: "absolute inset-0 rounded-full border-4 border-muted" }), _jsx("div", { className: "absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" })] }) }));
}
export function ButtonLoading() {
    return (_jsxs("span", { className: "relative h-4 w-4", children: [_jsx("span", { className: "absolute inset-0 rounded-full border-2 border-muted" }), _jsx("span", { className: "absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" })] }));
}

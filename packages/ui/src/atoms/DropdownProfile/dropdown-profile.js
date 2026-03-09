"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../DropdownMenu/dropdown-menu";
import { useAuth } from "@hooks/useAuth";
import { useSession } from "@hooks/features/auth/use-session";
export function ProfileDropdown({ isExpanded = false, onSelect }) {
    const { logout } = useAuth();
    // Reutiliza el cache de TanStack Query — cero requests HTTP adicionales
    const { user, isLoading } = useSession();
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center gap-3 px-1 py-1", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" }), isExpanded && (_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "h-3 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2 animate-pulse" }), _jsx("div", { className: "h-2 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" })] }))] }));
    }
    if (!user) {
        return null;
    }
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { className: "flex items-center justify-center rounded-full hover:ring-2 hover:ring-purple-500/30 transition-all focus:outline-none outline-none", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0", children: _jsx("span", { className: "text-white font-semibold text-xs", children: getInitials(user.name) }) }), isExpanded && (_jsxs("div", { className: "flex-1 text-left overflow-hidden ml-3", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: user.name }), _jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.email })] }))] }) }), _jsxs(DropdownMenuContent, { className: "w-56", align: "end", side: "bottom", sideOffset: 8, children: [_jsx(DropdownMenuLabel, { children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("p", { className: "text-sm font-medium", children: user.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: user.email })] }) }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuGroup, { children: [_jsxs(DropdownMenuItem, { onClick: () => onSelect?.('profile-settings'), className: "cursor-pointer", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Perfil" })] }), _jsxs(DropdownMenuItem, { onClick: () => onSelect?.('facturacion'), className: "cursor-pointer", children: [_jsx(CreditCard, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Facturaci\u00F3n" })] }), _jsxs(DropdownMenuItem, { onClick: () => onSelect?.('settings'), className: "cursor-pointer", children: [_jsx(Settings, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Configuraci\u00F3n" })] })] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: logout, className: "text-red-500 focus:text-red-500 focus:bg-red-500/10", children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Cerrar Sesi\u00F3n" })] })] })] }));
}

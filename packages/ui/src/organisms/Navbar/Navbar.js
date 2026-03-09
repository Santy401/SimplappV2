"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, CircleHelp, ChevronDown, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../../atoms/DropdownMenu/dropdown-menu";
import { ProfileDropdown } from "../../atoms/DropdownProfile/dropdown-profile";
import { NavbarDropdownSearch } from "../NavbarDropdownSearch/NavbarDropdownSearch";
import { NotificationDropdown } from "../NotificationDropdown/NotificationDropdown";
import { useSession } from "@hooks/features/auth/use-session";
import { cn } from "../../utils/utils";
export const Navbar = ({ onSearchOpen, onSelect, onMobileMenuToggle }) => {
    const { user, refetch } = useSession();
    const companies = user?.companies || [];
    const currentCompany = companies.find(c => c.id === user?.companyId) || companies[0];
    const handleSwitchCompany = async (companyId) => {
        try {
            const response = await fetch('/api/auth/switch-company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId }),
            });
            if (response.ok) {
                refetch();
                // Optionally reload to clear any context states
                window.location.reload();
            }
        }
        catch (error) {
            console.error('Error switching company:', error);
        }
    };
    return (_jsxs("nav", { className: "sticky top-0 z-50 flex items-center px-4 justify-between h-14 bg-white dark:bg-background/95 backdrop-blur-sm border-b border-sidebar-border w-full", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: onMobileMenuToggle, className: "sm:hidden p-2 -ml-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition", children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex items-center gap-2 ml-1", children: _jsx("button", { className: "hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-muted-foreground hover:text-foreground", children: _jsx(CircleHelp, { className: "w-5 h-5" }) }) })] }), _jsx("div", { className: "flex-1 max-w-xl mx-8 hidden sm:block relative", children: _jsx(NavbarDropdownSearch, { onSelect: onSelect, onOpenModal: onSearchOpen }) }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [_jsx(NotificationDropdown, { onSelectLink: onSelect }), _jsx("button", { className: "w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 border border-sidebar-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition", children: _jsx(Plus, { className: "w-4 h-4 text-foreground" }) }), companies.length > 0 && (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { className: "flex items-center gap-2 px-3 py-1.5 border border-sidebar-border bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition", children: [_jsx("div", { className: "w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold", children: currentCompany?.companyName?.charAt(0) || 'C' }), _jsx("span", { className: "text-sm font-medium text-foreground max-w-[100px] truncate", children: currentCompany?.companyName || 'Empresa' }), _jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })] }) }), _jsxs(DropdownMenuContent, { className: "w-56 bg-white dark:bg-slate-950 border-sidebar-border", children: [_jsx(DropdownMenuLabel, { children: "Empresas" }), _jsx(DropdownMenuSeparator, { className: "bg-sidebar-border" }), companies.map((c) => (_jsxs(DropdownMenuItem, { className: cn("cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between", c.id === currentCompany?.id && "bg-slate-50 dark:bg-slate-900/50 text-purple-500"), onClick: () => handleSwitchCompany(c.id), children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold mr-2", children: c.companyName.charAt(0) }), _jsx("span", { className: "truncate max-w-[120px]", children: c.companyName })] }), c.id === currentCompany?.id && _jsx("span", { className: "text-[10px] font-medium opacity-70", children: "(Actual)" })] }, c.id)))] })] })), _jsx(ProfileDropdown, { onSelect: onSelect })] })] }));
};

"use client"

import { ChevronDown, Menu, Search } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../atoms/DropdownMenu/dropdown-menu";

import { ProfileDropdown } from "../../atoms/DropdownProfile/dropdown-profile";
import { NavbarDropdownSearch } from "../NavbarDropdownSearch/NavbarDropdownSearch";
import { NotificationDropdown } from "../NotificationDropdown/NotificationDropdown";
import { QuickCreateModal } from "../../molecules/QuickCreateModal/QuickCreateModal";
import { QuickCreateDropdown } from "./components/QuickCreateDropdown";
import { useQuickActions } from "../../hooks/useQuickActions";
import { useSession } from "@hooks/features/auth/use-session";
import { cn } from "../../utils/utils";

interface NavbarProps {
    onSearchOpen: () => void;
    onSelect?: (view: string) => void;
    onMobileMenuToggle?: () => void;
}

export const Navbar = ({ onSearchOpen, onSelect, onMobileMenuToggle }: NavbarProps) => {
    const { user, refetch } = useSession();
    const {
        activeAction,
        values,
        isLoading,
        openAction,
        closeAction,
        handleValueChange,
        handleQuickSubmit,
        config
    } = useQuickActions(onSelect);

    const companies = user?.companies || [];
    const currentCompany = companies.find(c => c.id === user?.companyId) || companies[0];

    const handleSwitchCompany = async (companyId: string) => {
        try {
            const response = await fetch('/api/auth/switch-company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId }),
            });
            if (response.ok) {
                refetch();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error switching company:', error);
        }
    };

    return (
        <>
            <nav className="sticky top-0 z-[40] flex items-center px-6 justify-between h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 w-full transition-all duration-300">
                
                {/* Left side: Search Trigger */}
                <div className="flex items-center gap-4 flex-1 max-w-md">
                    <button
                        onClick={onMobileMenuToggle}
                        className="sm:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    
                    <div className="relative w-full group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        <button 
                            onClick={onSearchOpen}
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-left text-sm text-slate-400 hover:border-purple-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-text"
                        >
                            Buscar facturas, clientes...
                            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>
                </div>

                {/* Right side: Actions & User */}
                <div className="flex items-center gap-3">
                    
                    {/* Modular Quick Create Dropdown */}
                    <QuickCreateDropdown onOpenAction={openAction} onSelectView={onSelect} />

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                    <NotificationDropdown onSelectLink={onSelect} />

                    {companies.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 h-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-md shadow-purple-500/10">
                                        {currentCompany?.companyName?.charAt(0) || 'C'}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate hidden lg:block">
                                        {currentCompany?.companyName || 'Empresa'}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Cambiar Entorno</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {companies.map((c) => (
                                    <DropdownMenuItem
                                        key={c.id}
                                        className={cn(
                                            "p-2 rounded-xl cursor-pointer flex items-center justify-between group",
                                            c.id === currentCompany?.id && "bg-purple-50 dark:bg-purple-900/10"
                                        )}
                                        onClick={() => handleSwitchCompany(c.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                {c.companyName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold truncate max-w-[140px]">{c.companyName}</span>
                                        </div>
                                        {c.id === currentCompany?.id && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <ProfileDropdown onSelect={onSelect} />
                </div>
            </nav>

            {/* Quick Create Modal */}
            {activeAction && config && (
                <QuickCreateModal
                    open={!!activeAction}
                    onClose={closeAction}
                    title={config.title}
                    icon={config.icon}
                    description={config.description}
                    fields={config.fields}
                    values={values}
                    onChange={handleValueChange}
                    onSubmit={handleQuickSubmit}
                    submitLabel={config.submitLabel}
                    advancedLabel={config.advancedLabel}
                    onAdvanced={config.onAdvanced}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

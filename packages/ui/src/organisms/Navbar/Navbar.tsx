"use client"

import { Plus, CircleHelp, ChevronDown, Menu, User, Package, Store, FileText } from "lucide-react"
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
            <nav className="sticky top-0 z-50 flex items-center px-4 justify-between h-14 bg-white dark:bg-background/95 backdrop-blur-sm border-b border-sidebar-border w-full">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMobileMenuToggle}
                        className="sm:hidden p-2 -ml-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 ml-1">
                        <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-muted-foreground hover:text-foreground">
                            <CircleHelp className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Center - Search */}
                <div className="flex-1 max-w-xl mx-8 hidden sm:block relative">
                    <NavbarDropdownSearch
                        onSelect={onSelect}
                        onOpenModal={onSearchOpen}
                    />
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <NotificationDropdown onSelectLink={onSelect} />

                    {/* Quick Create Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 border border-sidebar-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                <Plus className="w-4 h-4 text-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-slate-950 border-sidebar-border">
                            <DropdownMenuLabel>Creación rápida</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-sidebar-border" />

                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onSelect?.('ventas-facturacion-create')}>
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span>Factura de venta</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openAction('client')}>
                                <User className="w-4 h-4 text-slate-400" />
                                <span>Nuevo cliente</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openAction('product')}>
                                <Package className="w-4 h-4 text-slate-400" />
                                <span>Nuevo producto</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openAction('store')}>
                                <Store className="w-4 h-4 text-slate-400" />
                                <span>Nueva bodega</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {companies.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-sidebar-border bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold">
                                        {currentCompany?.companyName?.charAt(0) || 'C'}
                                    </div>
                                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                                        {currentCompany?.companyName || 'Empresa'}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white dark:bg-slate-950 border-sidebar-border">
                                <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-sidebar-border" />
                                {companies.map((c) => (
                                    <DropdownMenuItem
                                        key={c.id}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between",
                                            c.id === currentCompany?.id && "bg-slate-50 dark:bg-slate-900/50 text-purple-500"
                                        )}
                                        onClick={() => handleSwitchCompany(c.id)}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold mr-2">
                                                {c.companyName.charAt(0)}
                                            </div>
                                            <span className="truncate max-w-[120px]">{c.companyName}</span>
                                        </div>
                                        {c.id === currentCompany?.id && <span className="text-[10px] font-medium opacity-70">(Actual)</span>}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <ProfileDropdown onSelect={onSelect} />
                </div>
            </nav>

            {/* Render the modal if an action is active */}
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



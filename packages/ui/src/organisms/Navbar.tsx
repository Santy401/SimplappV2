"use client"

import { Search, Plus, CircleHelp, Sprout, Grip, ChevronDown, User, LogOut, CreditCard, Menu } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../atoms/DropdownMenu/dropdown-menu";

import { ProfileDropdown } from "../atoms/DropdownProfile/dropdown-profile";
import { useLogout } from "@interfaces/src/hooks/features/auth"
import { NavbarDropdownSearch } from "./NavbarDropdownSearch";
import { NotificationDropdown } from "./NotificationDropdown";

interface NavbarProps {
    onSearchOpen: () => void;
    onSelect?: (view: string) => void;
    onMobileMenuToggle?: () => void;
}

export const Navbar = ({ onSearchOpen, onSelect, onMobileMenuToggle }: NavbarProps) => {
    const { handleLogout } = useLogout();

    return (
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
                    {/* ... (botones deshabilitados) ... */}
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
                <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 border border-sidebar-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    <Plus className="w-4 h-4 text-foreground" />
                </button>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-sidebar-border bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                S
                            </div>
                            <span className="text-sm font-medium text-foreground">Simplea...</span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white dark:bg-slate-950 border-sidebar-border">
                        <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-sidebar-border" />
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900">
                            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold mr-2">
                                S
                            </div>
                            <span>Simpleapp</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
                <ProfileDropdown onSelect={onSelect} />
            </div>
        </nav>
    )
}

"use client"

import { Search, Plus, CircleHelp, Sprout, Grip, ChevronDown, User, LogOut, CreditCard } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    ProfileDropdown,
} from "@ui/index"
import { useLogout } from "@interfaces/src/hooks/features/auth"

interface NavbarProps {
    onSearchOpen: () => void;
    onSelect?: (view: string) => void;
}

export const Navbar = ({ onSearchOpen, onSelect }: NavbarProps) => {
    const { handleLogout } = useLogout();

    return (
        <nav className="sticky top-0 z-50 flex items-center px-4 justify-between h-14 bg-white dark:bg-background/95 backdrop-blur-sm border-b border-sidebar-border w-full">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 ml-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-muted-foreground hover:text-foreground">
                        <CircleHelp className="w-5 h-5" />
                    </button>
                    {/* <button className="w-8 h-8 flex items-center justify-center rounded-full border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition">
                        <Sprout className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-muted-foreground hover:text-foreground">
                        <Grip className="w-5 h-5" />
                    </button> */}
                </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-xl mx-8 hidden sm:block">
                <button
                    onClick={onSearchOpen}
                    className="w-full relative group"
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900/50 border border-sidebar-border rounded-xl text-sm text-left text-muted-foreground flex items-center justify-between hover:border-primary/50 transition-all cursor-text">
                        <span>Buscar...</span>
                        <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground border border-sidebar-border font-mono">
                            <span className="text-[12px]">⌘</span>K
                        </kbd>
                    </div>
                </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
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
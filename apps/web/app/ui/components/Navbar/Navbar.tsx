"use client"

import { PanelLeftOpen, Search, Bell, Settings, LucideIcon, User, LogOut, CreditCard } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/cn/components/ui/dropdown-menu"
import { useLogout } from "@/interfaces/hooks/features/auth"

export const Navbar = () => {
    const { handleLogout } = useLogout();

    const IconButton = ({ icon: Icon }: { icon: LucideIcon }) => (
        <span className="h-9 w-9 bg-[#303030] flex rounded-4xl items-center justify-center cursor-pointer">
            <Icon className="text-white scale-[80%]" />
        </span>
    )

    return (
        <div>
            <nav className="flex items-center p-4 justify-between h-13 bg-[#171717]">
                <div className="flex items-center gap-3">
                    <IconButton icon={PanelLeftOpen} />
                    <label className="text-white font-extrabold">Dashboard</label>
                </div>
                <h1 className="text-[#ddd] font-bold text-[1.2rem]">SolanaBackend</h1>
                <div className="flex gap-2">
                    <IconButton icon={Search} />
                    <IconButton icon={Bell} />
                    <IconButton icon={Settings} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <span className="h-9 w-9 bg-[#303030] flex rounded-4xl items-center justify-center cursor-pointer relative overflow-hidden">
                                <Image
                                    src="/Admin/PhotoFile.png"
                                    fill
                                    className="object-cover"
                                    alt="Profile"
                                />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-[#ffffff] border-gray-300 text-black">
                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-300" />
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#dadada] focus:bg-[#dfdfdf]">
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#dadada] focus:bg-[#dfdfdf]">
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Facturación</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-300" />
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#dadada] focus:bg-[#dfdfdf] text-red-600" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar Sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </div>
    )
}
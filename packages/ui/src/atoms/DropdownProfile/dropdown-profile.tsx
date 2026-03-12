"use client"

import { User, Settings, LogOut, CreditCard, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../DropdownMenu/dropdown-menu"
import { useAuth } from "@hooks/useAuth"
import { useSession } from "@hooks/features/auth/use-session"
import { cn } from "../../utils/utils"

interface ProfileDropdownProps {
  isExpanded?: boolean
  onSelect?: (view: string) => void
}

export function ProfileDropdown({ isExpanded = false, onSelect }: ProfileDropdownProps) {
  const { logout } = useAuth()
  const { user, isLoading } = useSession()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
    )
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex items-center justify-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 transition-all focus:outline-none shadow-sm"
        >
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#6C47FF] to-[#4318FF] flex items-center justify-center shrink-0 shadow-md shadow-purple-500/10 transition-transform group-hover:scale-95">
            <span className="text-white font-black text-[10px] tracking-tighter">
              {getInitials(user.name)}
            </span>
          </div>
          {isExpanded && (
            <div className="flex-1 text-left overflow-hidden ml-3 pr-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                Administrador
              </p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{user.name}</span>
                <div className="px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/20 text-[9px] font-black text-purple-600 uppercase tracking-wider border border-purple-100 dark:border-purple-900/30 flex items-center gap-1">
                    <Shield size={10} />
                    PRO
                </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem onClick={() => onSelect?.('profile-settings')} className="p-3 rounded-xl cursor-pointer gap-3 focus:bg-slate-50 dark:focus:bg-slate-900">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <User size={16} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Mi Perfil</span>
                <span className="text-[10px] text-slate-400">Datos personales y seguridad</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onSelect?.('facturacion')} className="p-3 rounded-xl cursor-pointer gap-3 focus:bg-slate-50 dark:focus:bg-slate-900">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <CreditCard size={16} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Suscripción</span>
                <span className="text-[10px] text-slate-400">Plan actual y pagos</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onSelect?.('settings')} className="p-3 rounded-xl cursor-pointer gap-3 focus:bg-slate-50 dark:focus:bg-slate-900">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Settings size={16} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Ajustes</span>
                <span className="text-[10px] text-slate-400">Configuración global</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-1">
            <DropdownMenuItem
                onClick={logout}
                className="p-3 rounded-xl cursor-pointer gap-3 text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20"
            >
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                    <LogOut size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm">Cerrar Sesión</span>
                    <span className="text-[10px] text-rose-400/70">Salir de la cuenta de forma segura</span>
                </div>
            </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import { User, Settings, LogOut, CreditCard } from "lucide-react"
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
import { useEffect, useState } from "react"

interface UserData {
  id: number
  email: string
  name: string
  typeAccount: string
  country: string
}

interface ProfileDropdownProps {
  isExpanded: boolean
}

export function ProfileDropdown({ isExpanded }: ProfileDropdownProps) {
  const { logout } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

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
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
        {isExpanded && (
          <div className="flex-1">
            <div className="h-3 bg-slate-700 rounded w-24 mb-2 animate-pulse" />
            <div className="h-2 bg-slate-700 rounded w-32 animate-pulse" />
          </div>
        )}
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-3 w-42 px-4 py-3 rounded-lg hover:bg-purple-400/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-xs">
              {getInitials(userData.name)}
            </span>
          </div>
          {isExpanded && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {userData.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userData.email}
              </p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userData.name}</p>
            <p className="text-xs text-muted-foreground">{userData.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Facturación</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
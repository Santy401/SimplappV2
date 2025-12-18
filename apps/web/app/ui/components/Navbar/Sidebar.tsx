"use client"

import type React from "react"
import { useState } from "react"
import {
  Home,
  BarChart3,
  TrendingUp,
  Bell,
  Globe,
  Newspaper,
  LineChart,
  Vault,
  Wallet,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Inbox,
} from "lucide-react"
import { cn } from "@simplapp/ui"
import { ThemeToggle } from "@simplapp/ui"
import { ProfileDropdown } from "@simplapp/ui"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  submenu?: NavItem[]
  badge?: number | string
  variant?: "default" | "active"
}

interface SidebarProps {
  onSelect?: (id: string) => void
}

export default function Sidebar({ onSelect }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["ventas"])
  const [activeItem, setActiveItem] = useState("inicio")
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const navItems: NavItem[] = [
    { id: "inicio", label: "Inicio", icon: <Home size={20} />, badge: 3 },
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} />, variant: "active" },
    {
      id: "ventas",
      label: "Ventas",
      icon: <TrendingUp size={20} />,
      submenu: [
        { id: "ventas-venta", label: "Comprobante De Venta", icon: null },
        { id: "ventas-cotizaciones", label: "Cotizaciones", icon: null },
        { id: "ventas-remisiones", label: "Remisiones", icon: null },
        { id: "ventas-clientes", label: "Clientes", icon: null },
        { id: "ventas-productos", label: "Productos De Venta", icon: null },
        { id: "ventas-vendedor", label: "Vendedores", icon: null },
        { id: "ventas-bodega", label: "Bodega", icon: null },
      ],
    },
    {
      id: "Inventario",
      label: "Inventario",
      icon: <Inbox size={20}/>,
      submenu: [
        { id: "inventario-precios", label: "Lista Precios", icon: null }
      ]
    },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} />, badge: "9+" },
    { id: "market", label: "Market", icon: <Globe size={20} /> },
    { id: "news", label: "News", icon: <Newspaper size={20} /> },
    { id: "interactive-chart", label: "Interactive Chart", icon: <LineChart size={20} /> },
    { id: "mutual-funds", label: "Mutual Funds", icon: <Vault size={20} /> },
    { id: "portfolio", label: "Portfolio", icon: <Wallet size={20} />, badge: "●" },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-background from-slate-900 via-slate-900 to-slate-950 border-r border-sidebar-border flex flex-col text-slate-300 font-sans overflow-hidden transition-all duration-300",
        isExpanded ? "w-62" : "w-20", "sticky top-0 left-0 z-50"
      )}
    >
      <div className={cn("border-b border-sidebar-border", isExpanded ? "p-6" : "p-4")}>
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {isExpanded && <span className="text-foreground font-bold text-lg tracking-tight">Simplapp</span>}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {isExpanded && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full border border-[#2d2d2d] rounded-lg pl-9 pr-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-slate-300"
            />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                setActiveItem(item.id)
                if (item.submenu) {
                  toggleSubmenu(item.id)
                } else {
                  onSelect?.(item.id)
                }
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isExpanded ? "px-4" : "px-2 justify-center",
                activeItem === item.id
                  ? "bg-ring text-purple-200 shadow-lg shadow-purple-500/10"
                  : "hover:bg-forground text-foreground-text hover:foreground-text-second00",
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="flex itemss-center gap-3 w-fit">
                <div
                  className={cn(
                    "flex items-center justify-center flex-shrink-0",
                    activeItem === item.id ? "text-purple-400" : "group-hover:text-purple-400/60",
                  )}
                >
                  {item.icon}
                </div>
                {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
              </div>

              {isExpanded && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.badge && (
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        item.badge === "●" ? "text-green-400 bg-transparent" : "bg-purple-500/20 text-purple-300",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.submenu &&
                    (expandedItems.includes(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </div>
              )}
            </button>
            {isExpanded && item.submenu && expandedItems.includes(item.id) && (
              <div className="ml-4 mt-2 space-y-1 border-l border-[#2d2d2d] pl-3">
                {item.submenu.map((subitem) => (
                  <button
                    key={subitem.id}
                    onClick={() => {
                      setActiveItem(subitem.id)
                      onSelect?.(subitem.id)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 hover:bg-purple-400 text-[13px] cursor pointer rounded-lg transition-all duration-200",
                      activeItem === subitem.id
                        ? "bg-foreground-bg-bar text-secondary-foreground font-medium"
                        : "text-foreground-text"
                    )}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className={cn("border-t relative border-sidebar-border space-y-1", isExpanded ? "p-3" : "p-2")}>
        <button
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-slate-800/50 text-foreground-text hover:text-slate-300 transition-all duration-200 group",
            isExpanded ? "w-full px-4 py-3" : "w-full px-2 py-3 justify-center",
          )}
          title={!isExpanded ? "Support" : undefined}
        >
          <AlertCircle size={20} className="flex-shrink-0 group-hover:text-purple-400/60" />
          {isExpanded && <span className="text-sm font-medium">Support</span>}
        </button>
        <div className="flex items-center gap-3">
        <ProfileDropdown isExpanded={isExpanded} />
        {isExpanded && <div><ThemeToggle /></div>}
        </div>
      </div>
    </div>
  )
}
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
  const [isPinned, setIsPinned] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const isExpanded = isPinned || isHovered

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const navItems: NavItem[] = [
    { id: "inicio", label: "Inicio", icon: <Home size={20} /> },
    {
      id: "ventas",
      label: "Ventas",
      icon: <TrendingUp size={20} />,
      submenu: [
        { id: "ventas-facturacion", label: "Facturacion", icon: null },
        //{ id: "ventas-venta", label: "Comprobante De Venta", icon: null },
        //{ id: "ventas-cotizaciones", label: "Cotizaciones", icon: null },
        //{ id: "ventas-remisiones", label: "Remisiones", icon: null },
        { id: "ventas-clientes", label: "Clientes", icon: null },
        { id: "ventas-productos", label: "Productos De Venta", icon: null },
        { id: "ventas-vendedor", label: "Vendedores", icon: null },
      ],
    },
    {
      id: "Inventario",
      label: "Inventario",
      icon: <Inbox size={20} />,
      submenu: [
        { id: "inventario-precios", label: "Lista Precios", icon: null },
        { id: "inventario-bodega", label: "Bodega", icon: null },
      ]
    },
    // { id: "notifications", label: "Notifications", icon: <Bell size={20} />, badge: "9+" },
    // { id: "market", label: "Market", icon: <Globe size={20} /> },
    // { id: "news", label: "News", icon: <Newspaper size={20} /> },
    // { id: "interactive-chart", label: "Interactive Chart", icon: <LineChart size={20} /> },
    // { id: "mutual-funds", label: "Mutual Funds", icon: <Vault size={20} /> },
    // { id: "portfolio", label: "Portfolio", icon: <Wallet size={20} />, badge: "●" },
  ]

  return (
    <div
      className={cn(
        "h-screen sticky top-0 left-0 z-50 transition-[width] duration-300 flex-shrink-0 outline-none",
        isPinned ? "w-62" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-screen border-r border-sidebar-border flex flex-col font-sans overflow-hidden transition-all duration-300 z-50",
          "bg-white text-slate-700 dark:bg-slate-950 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-slate-300",
          isExpanded ? "w-62" : "w-20",
          !isPinned && isHovered && "shadow-2xl shadow-black/10 dark:shadow-black/30"
        )}
      >
        <div className="border-b border-sidebar-border py-5 px-6 flex items-center h-[72px] box-border">
          <div className="flex items-center justify-between gap-2 overflow-hidden w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              {isExpanded && <span className="text-foreground font-bold text-lg tracking-tight whitespace-nowrap">Simplapp</span>}
            </div>
            {isExpanded && (
              <button
                onClick={() => {
                  const newPinnedState = !isPinned;
                  setIsPinned(newPinnedState);
                  if (!newPinnedState) {
                    setIsHovered(false);
                  }
                }}
                className="p-1 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
                title={isPinned ? "Ocultar sidebar" : "Fijar sidebar"}
              >
                {isPinned ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            )}
          </div>

          {/* {isExpanded && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full border border-[#2d2d2d] rounded-lg pl-9 pr-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-slate-300"
            />
          </div>
        )} */}
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
                  "w-full flex items-center justify-between py-2 px-6 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  activeItem === item.id
                    ? "text-purple-400 bg-purple-500/5 font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-purple-500"
                    : "hover:bg-forground text-foreground-text hover:foreground-text-second00",
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <div className="flex items-center gap-4 w-fit">
                  <div
                    className={cn(
                      "flex items-center justify-center flex-shrink-0",
                      activeItem === item.id ? "text-purple-400" : "group-hover:text-purple-400/60",
                    )}
                  >
                    {item.icon}
                  </div>
                  {isExpanded && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
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
              {item.submenu && (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded && expandedItems.includes(item.id)
                      ? "max-h-[500px] opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  )}
                >
                  <div className="ml-4 space-y-1 pl-3">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => {
                          setActiveItem(subitem.id)
                          onSelect?.(subitem.id)
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer rounded-lg transition-all duration-200 relative overflow-hidden",
                          activeItem === subitem.id
                            ? "text-purple-400 bg-purple-500/10 font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-purple-500/50"
                            : "text-foreground-text hover:bg-purple-500/5 hover:text-purple-300"
                        )}
                      >
                        {subitem.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t relative border-sidebar-border space-y-1 py-4 px-1 flex items-center h-[64px] box-border">
          {/* <button
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-slate-800/50 text-foreground-text hover:text-slate-300 transition-all duration-200 group",
            isExpanded ? "w-full px-4 py-3" : "w-full px-2 py-3 justify-center",
          )}
          title={!isExpanded ? "Support" : undefined}
        >
          <AlertCircle size={20} className="flex-shrink-0 group-hover:text-purple-400/60" />
          {isExpanded && <span className="text-sm font-medium">Support</span>}
        </button> */}
          <div className="flex items-center gap-3">
            <ProfileDropdown isExpanded={isExpanded} />
            {/* {isExpanded && <div><ThemeToggle /></div>} */}
          </div>
        </div>
      </div>
    </div>
  )
}
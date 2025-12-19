'use client';

import { UsersRound, Package, ShoppingCart, BarChart3, Wallet, FileText, Settings, TrendingUp } from "lucide-react"
import OptionTarget from "@/app/ui/styles/Modules/button.module.css"

const OPTIONS_CONFIG = [
    {
        id: 'clients',
        title: 'Clientes',
        icon: UsersRound,
    },
    {
        id: 'products',
        title: 'Productos',
        icon: Package,
    },
    {
        id: 'orders',
        title: 'Pedidos',
        icon: ShoppingCart,
    },
]

interface OptionCardProps {
    title: string
    icon: React.ElementType
    onView?: () => void
    onCreate?: () => void
}

const OptionCard = ({ title, icon: Icon, onView, onCreate }: OptionCardProps) => {
    return (
        <div className="flex flex-col justify-center items-center border border-sidebar-border p-10 text-white m-2 rounded-2xl hover:scale-102 transition-all duration-200 ease-in-out">
            <Icon className="w-10 h-10 mb-3 text-purple-400" />
            <span className="text-[15px] font-semibold text-secondary-foreground mb-4">{title}</span>
            <div className="flex gap-3 mt-2">
                <button
                    onClick={onView}
                    className={OptionTarget.OptionsTargetButtons}
                >
                    Ver
                </button>
                <button
                    onClick={onCreate}
                    className={OptionTarget.OptionsTargetButtons}
                >
                    Crear
                </button>
            </div>
        </div>
    )
}

export const OptionsTargets = () => {
    const handleView = (id: string) => {
        console.log(`Ver ${id}`)
    }

    const handleCreate = (id: string) => {
        console.log(`Crear ${id}`)
    }

    return (
<div className="flex flex-wrap justify-center gap-16 w-full">
    {OPTIONS_CONFIG.map((option) => (
        <OptionCard
            key={option.id}
            title={option.title}
            icon={option.icon}
            onView={() => handleView(option.id)}
            onCreate={() => handleCreate(option.id)}
        />
    ))}
</div>
    )
}
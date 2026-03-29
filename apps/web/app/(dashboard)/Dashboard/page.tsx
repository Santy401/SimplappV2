'use client';

import { useEffect, useState } from "react";
import { useSession } from "@interfaces/src/hooks/features/auth/use-session";
import { useRouter } from "next/navigation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
    TrendingUp, Users, Receipt, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, 
    Loader2, FileText, CheckCircle2, AlertCircle, Ban, Clock, 
    Plus, Package, UserPlus, FilePlus, BarChart3, Clock3, Zap
} from "lucide-react";

interface DashboardMetrics {
    totals: {
        currentSales: number;
        previousSales: number;
        salesGrowth: number;
        pendingBillsCount: number;
        pendingBillsValue: number;
        totalClients: number;
    };
    recentBills: Array<{
        id: string;
        prefix: string;
        number: number;
        clientName: string;
        total: number;
        status: string;
        date: string;
    }>;
    monthlySales: Array<{ name: string; total: number }>;
}

type BillStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED' | 'TO_PAY';

const statusConfig: Record<BillStatus, {
    label: string;
    badge: string;
    icon: React.ElementType;
}> = {
    DRAFT: { label: "Borrador", badge: "bg-slate-100 text-slate-600", icon: FileText },
    ISSUED: { label: "Emitida", badge: "bg-blue-50 text-blue-600", icon: Receipt },
    PAID: { label: "Pagada", badge: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
    PARTIALLY_PAID: { label: "Pago Parcial", badge: "bg-amber-50 text-amber-600", icon: AlertCircle },
    CANCELLED: { label: "Cancelada", badge: "bg-red-50 text-red-600", icon: Ban },
    TO_PAY: { label: "Por Pagar", badge: "bg-violet-50 text-violet-600", icon: Clock },
};

interface MetricCardProps {
    label: string;
    value: string;
    icon: React.ElementType;
    trend?: { value: number; positive: boolean };
    subtitle?: string;
}

function MetricCard({ label, value, icon: Icon, trend, subtitle }: MetricCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 hover:border-[#6C47FF]/30 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6C47FF]/10 flex items-center justify-center group-hover:bg-[#6C47FF]/20 transition-colors">
                    <Icon size={16} className="text-[#6C47FF]" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
            </div>
            <p className="text-2xl font-bold text-[#6C47FF] mb-2">
                {value}
            </p>
            {trend ? (
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(trend.value).toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-400">{subtitle}</span>
                </div>
            ) : subtitle ? (
                <p className="text-xs text-slate-400">{subtitle}</p>
            ) : null}
        </div>
    );
}

interface QuickActionProps {
    label: string;
    icon: React.ElementType;
    href: string;
    variant?: 'primary' | 'secondary';
}

function QuickAction({ label, icon: Icon, href, variant = 'primary' }: QuickActionProps) {
    const router = useRouter();
    const baseClasses = "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";
    
    const variants = {
        primary: "bg-[#6C47FF] text-white hover:bg-[#5835E8] shadow-sm shadow-[#6C47FF]/25",
        secondary: "bg-white border border-slate-200 text-slate-700 hover:border-[#6C47FF]/30 hover:text-[#6C47FF]"
    };

    return (
        <button 
            onClick={() => router.push(href)}
            className={`${baseClasses} ${variants[variant]} w-full justify-center`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

export default function Dashboard() {
    const { user } = useSession();
    const userName = user?.name || "Administrador";
    const router = useRouter();

    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch('/api/metrics/dashboard')
            .then(res => res.json())
            .then(data => {
                if (mounted && !data.error) {
                    setMetrics(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (mounted) setIsLoading(false);
            });
        return () => { mounted = false };
    }, []);

    const currencyFormat = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    if (isLoading || !metrics) {
        return (
            <div className="flex w-full h-[60vh] items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-[#6C47FF] animate-spin" />
            </div>
        );
    }

    const formatShortName = (name: string) => {
        if (!name) return "Consumidor Final";
        const parts = name.split(" ");
        if (parts.length > 2) return `${parts[0]} ${parts[parts.length - 1]}`;
        return name;
    }

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status.toUpperCase() as BillStatus;
        const config = statusConfig[normalizedStatus] || statusConfig.DRAFT;
        const StatusIcon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const { totals, monthlySales, recentBills } = metrics;
    const isGrowthPositive = totals.salesGrowth >= 0;
    const avgTicket = totals.currentSales > 0 && recentBills.length > 0
        ? totals.currentSales / recentBills.length
        : 0;

    const quickActions = [
        { label: "Nueva Factura", icon: FilePlus, href: "/ventas/facturacion/create", variant: 'primary' as const },
        { label: "Nuevo Cliente", icon: UserPlus, href: "/ventas/clientes/create", variant: 'secondary' as const },
        { label: "Nuevo Producto", icon: Package, href: "/ventas/productos/create", variant: 'secondary' as const },
    ];

    return (
        <div className="w-full pb-10 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800 mb-1">
                        Hola, {userName.split(" ")[0]}
                    </h1>
                    <p className="text-sm text-slate-500">
                        Resumen de tu negocio hoy.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <MetricCard 
                        label="Ventas del Mes" 
                        value={currencyFormat.format(totals.currentSales)} 
                        icon={DollarSign}
                        trend={{ value: totals.salesGrowth, positive: isGrowthPositive }}
                        subtitle="vs mes anterior"
                    />
                    <MetricCard 
                        label="Por Cobrar" 
                        value={currencyFormat.format(totals.pendingBillsValue)} 
                        icon={Wallet}
                        subtitle={`${totals.pendingBillsCount} facturas`}
                    />
                    <MetricCard 
                        label="Clientes" 
                        value={totals.totalClients.toString()} 
                        icon={Users}
                        subtitle="registrados"
                    />
                    <MetricCard 
                        label="Ticket Promedio" 
                        value={currencyFormat.format(avgTicket)} 
                        icon={TrendingUp}
                        subtitle="por factura"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#6C47FF]/10 flex items-center justify-center">
                                    <BarChart3 size={16} className="text-[#6C47FF]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700">Ventas</h3>
                                    <p className="text-xs text-slate-400">Últimos 6 meses</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6C47FF" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6C47FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        }}
                                        itemStyle={{ color: '#6C47FF', fontWeight: 600 }}
                                        formatter={(value: number | undefined) => value ? currencyFormat.format(value) : ''}
                                        labelStyle={{ color: '#64748b', fontSize: 12 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#6C47FF"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
                                        <Zap size={14} className="text-[#6C47FF]" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Acciones Rápidas</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {quickActions.map((action) => (
                                    <QuickAction key={action.href} {...action} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
                                        <Clock3 size={14} className="text-[#6C47FF]" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Recordatorios</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {totals.pendingBillsCount > 0 ? (
                                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-800">Facturas pendientes</p>
                                            <p className="text-xs text-amber-600">{totals.pendingBillsCount} facturas por cobrar</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-emerald-800">¡Todo al día!</p>
                                            <p className="text-xs text-emerald-600">No hay facturas pendientes</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
                                <Receipt size={14} className="text-[#6C47FF]" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Facturas Recientes</span>
                        </div>
                        {recentBills.length > 0 && (
                            <button 
                                onClick={() => router.push('/ventas/facturacion')}
                                className="text-xs font-medium text-[#6C47FF] hover:text-[#5835E8] transition-colors"
                            >
                                Ver todas →
                            </button>
                        )}
                    </div>

                    {recentBills.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl">
                            <Receipt size={32} className="text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500">Sin facturas aún</p>
                            <button 
                                onClick={() => router.push('/ventas/facturacion/create')}
                                className="mt-3 text-xs font-medium text-[#6C47FF] hover:text-[#5835E8] flex items-center gap-1"
                            >
                                <Plus size={14} />
                                Crear primera factura
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {recentBills.slice(0, 8).map((bill) => (
                                <div 
                                    key={bill.id} 
                                    onClick={() => router.push(`/ventas/facturacion/view?id=${bill.id}`)}
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#6C47FF]/20 hover:bg-[#6C47FF]/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-[#6C47FF]/10 flex flex-col items-center justify-center shrink-0 group-hover:bg-[#6C47FF]/20 transition-colors">
                                            <span className="text-[8px] text-[#6C47FF] uppercase font-bold">{bill.prefix || 'N/'}</span>
                                            <span className="text-[11px] text-[#6C47FF] font-medium">{bill.number}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-sm font-medium text-slate-700 block truncate">
                                                {formatShortName(bill.clientName)}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(bill.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {currencyFormat.format(bill.total)}
                                        </p>
                                        {getStatusBadge(bill.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState, useRef } from "react";

const dashboardMetricsCache: Record<number, DashboardMetrics> = {};
const isFirstLoad = true;
import { useSession } from "@interfaces/src/hooks/features/auth/use-session";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

function DashboardSkeleton() {
    return (
        <div className="w-full pb-10 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <header className="mb-8">
                    <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
                                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                            </div>
                            <div className="h-8 w-32 bg-slate-100 rounded animate-pulse mb-2" />
                            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
                            <div>
                                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse mb-1" />
                                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="h-[280px] w-full bg-slate-50 rounded-xl animate-pulse" />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-md bg-slate-100 animate-pulse" />
                                <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                                <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                                <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-md bg-slate-100 animate-pulse" />
                                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                            </div>
                            <div className="h-16 w-full bg-slate-100 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-md bg-slate-100 animate-pulse" />
                        <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse" />
                                    <div>
                                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse mb-1" />
                                        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="h-4 w-20 bg-slate-100 rounded animate-pulse mb-1" />
                                    <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useSession();
    const userName = user?.name || "Administrador";
    const router = useRouter();
    const hasFetched = useRef(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const [metrics, setMetrics] = useState<DashboardMetrics | null>(dashboardMetricsCache[selectedYear] || null);
    const [isLoading, setIsLoading] = useState(!dashboardMetricsCache[selectedYear]);

    const refreshMetrics = () => {
        setIsRefreshing(true);
        fetch(`/api/metrics/dashboard?year=${selectedYear}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    dashboardMetricsCache[selectedYear] = data;
                    setMetrics(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsRefreshing(false));
    };

    useEffect(() => {
        if (dashboardMetricsCache[selectedYear]) {
            setMetrics(dashboardMetricsCache[selectedYear]);
            setIsLoading(false);
            return;
        }

        let mounted = true;
        setIsLoading(true);
        fetch(`/api/metrics/dashboard?year=${selectedYear}`)
            .then(res => res.json())
            .then(data => {
                if (mounted && !data.error) {
                    dashboardMetricsCache[selectedYear] = data;
                    setMetrics(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (mounted) {
                    setIsLoading(false);
                }
            });
        return () => { mounted = false };
    }, [selectedYear]);

    const currencyFormat = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    if (isLoading || !metrics) {
        return <DashboardSkeleton />;
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
                <header className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 mb-1">
                            Hola, {userName.split(" ")[0]}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Resumen de tu negocio hoy.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-[#6C47FF] focus:border-[#6C47FF] block px-3 py-2 outline-none cursor-pointer hover:border-[#6C47FF]/30 transition-colors shadow-sm"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button
                            onClick={refreshMetrics}
                            disabled={isRefreshing}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:border-[#6C47FF]/30 hover:text-[#6C47FF] transition-colors disabled:opacity-50 shadow-sm"
                            title="Actualizar datos"
                        >
                            <Loader2 size={18} className={isRefreshing ? "animate-spin" : ""} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <MetricCard 
                        label="Ventas del Año" 
                        value={currencyFormat.format(totals.currentSales)} 
                        icon={DollarSign}
                        trend={{ value: totals.salesGrowth, positive: isGrowthPositive }}
                        subtitle="vs año anterior"
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
                                    <p className="text-xs text-slate-400">Año {selectedYear}</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="#6C47FF"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
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

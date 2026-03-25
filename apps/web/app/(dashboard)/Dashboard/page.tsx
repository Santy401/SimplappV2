'use client';

import { useEffect, useState } from "react";
import { useSession } from "@interfaces/src/hooks/features/auth/use-session";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Receipt, DollarSign, Activity, Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { cn } from "@simplapp/ui/src/utils/utils";

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

export default function Dashboard() {
    const { user } = useSession();
    const userName = user?.name || "Administrador";

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
        return () => { mounted = false; };
    }, []);

    const currencyFormat = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    if (isLoading || !metrics) {
        return (
            <div className="flex w-full h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
        );
    }

    const formatShortName = (name: string) => {
        if (!name) return "Consumidor Final";
        const parts = name.split(" ");
        if (parts.length > 2) return `${parts[0]} ${parts[parts.length - 1]}`;
        return name;
    }

    const { totals, monthlySales, recentBills } = metrics;
    const isGrowthPositive = totals.salesGrowth >= 0;

    return (
        <div className="w-full pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <header className="mb-8 mt-2">
                <div className="inline-block px-3 py-1 mb-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-semibold tracking-widest rounded-full uppercase">
                    Resumen General
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800 mb-1">
                    xd de nuevo, {userName.split(" ")[0]} 👋
                </h1>
                <p className="text-slate-500 text-sm">
                    Aquí está el resumen de cómo va tu negocio hoy.
                </p>
            </header>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Ingresos Mes */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 blur-[50px] rounded-full group-hover:bg-purple-100 transition-all" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-200/50">
                                <DollarSign size={16} className="text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">Ventas del Mes</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                            {currencyFormat.format(totals.currentSales)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={cn(
                                "flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded",
                                isGrowthPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            )}>
                                {isGrowthPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(totals.salesGrowth).toFixed(1)}%
                            </span>
                            <span className="text-slate-400 truncate">vs. mes anterior</span>
                        </div>
                    </div>
                </div>

                {/* Por Cobrar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 blur-[50px] rounded-full group-hover:bg-orange-100 transition-all" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200/50">
                            <Wallet size={16} className="text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Cuentas por Cobrar</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                            {currencyFormat.format(totals.pendingBillsValue)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-500 text-xs">
                                {totals.pendingBillsCount} facturas pendientes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Clientes Activos */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-[50px] rounded-full group-hover:bg-blue-100 transition-all" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200/50">
                            <Users size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Clientes Activos</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-2 text-left">
                            {totals.totalClients}
                        </h3>
                        <div className="text-sm text-slate-400">
                            Registrados en la plataforma
                        </div>
                    </div>
                </div>

                {/* Ticket Promedio */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 blur-[50px] rounded-full group-hover:bg-purple-100 transition-all" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center border border-purple-200/50">
                            <Activity size={16} className="text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Ticket Promedio</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                            {currencyFormat.format(
                                totals.currentSales > 0 && recentBills.length > 0
                                    ? totals.currentSales / Object.keys(recentBills).length
                                    : 0
                            )}
                        </h3>
                        <div className="text-sm text-slate-400">
                            Estimado de ventas recientes
                        </div>
                    </div>
                </div>
            </div>

            {/* Dos grandes columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Crecimiento de Ventas</h3>
                            <p className="text-sm text-slate-500">Ingresos netos de los últimos 6 meses</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center border border-purple-200/50">
                            <TrendingUp size={20} className="text-purple-600" />
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                                        color: '#1e293b'
                                    }}
                                    itemStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                                    formatter={(value: any) => currencyFormat.format(value)}
                                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Últimas Facturas</h3>
                        <div className="w-8 h-8 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>

                    {recentBills.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <Receipt size={40} className="text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">Aún no hay facturas.</p>
                            <p className="text-xs text-slate-400 mt-1">Crea tu primera factura para verla aquí.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {recentBills.map((bill) => (
                                <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors">
                                            <span className="text-[9px] text-purple-600 uppercase leading-none font-bold mb-0.5 group-hover:text-white transition-colors">{bill.prefix || 'N/'}</span>
                                            <span className="text-xs text-purple-800 leading-none group-hover:text-purple-100 transition-colors">{bill.number}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700 truncate max-w-[140px] group-hover:text-slate-900 transition-colors">
                                                {formatShortName(bill.clientName)}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(bill.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-emerald-600">
                                            {currencyFormat.format(bill.total)}
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                                            {bill.status}
                                        </div>
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

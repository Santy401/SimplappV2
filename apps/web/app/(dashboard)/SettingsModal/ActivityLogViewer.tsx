"use client";

import React, { useEffect, useState } from 'react';
import { RefreshCw, Activity, User, MonitorSmartphone, MapPin, Search } from 'lucide-react';
import { cn } from '@simplapp/ui';

interface ActivityLogItem {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: any;
    metadata: any;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    } | null;
}

export function ActivityLogViewer() {
    const [logs, setLogs] = useState<ActivityLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/activity-log');
            if (!res.ok) throw new Error('Error al cargar logs');
            const data = await res.json();
            setLogs(data);
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        const act = action.toUpperCase();
        if (act === 'CREATE') return 'text-green-600 bg-green-100 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30';
        if (act === 'UPDATE') return 'text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
        if (act === 'DELETE') return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30';
        if (act === 'CANCEL') return 'text-orange-600 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
        if (act === 'LOGIN') return 'text-purple-600 bg-purple-100 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30';
        return 'text-slate-600 bg-slate-100 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30';
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div>
                    <h2 className="text-xl font-bold">Registro de Actividad</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Revisa los eventos recientes de tu equipo y sistema.
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                </button>
            </div>

            <div className="py-4 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por usuario, acción o entidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-4 pb-4">
                {loading && logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                        <p>Cargando actividad...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-48 text-red-500">
                        <Activity className="w-8 h-8 mb-4 opacity-50" />
                        <p>{error}</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <Activity className="w-8 h-8 mb-4 opacity-50" />
                        <p className="text-sm">No se encontraron registros activos.</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute top-4 bottom-4 left-6 w-px bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-6">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="relative flex items-start gap-4">
                                    <div className="relative z-10 w-12 h-12 flex shrink-0 items-center justify-center bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                                        {log.user ? (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                                                {log.user.name.charAt(0).toUpperCase()}
                                            </div>
                                        ) : (
                                            <Activity className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/20 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={cn("px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border", getActionColor(log.action))}>
                                                    {log.action}
                                                </span>
                                                <span className="font-medium text-sm text-slate-900 dark:text-white">
                                                    {log.entityType} <span className="text-slate-400 font-mono text-xs ml-1">#{log.entityId.slice(0, 8)}</span>
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {log.user && (
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                <strong>{log.user.name}</strong> realizó esta acción.
                                            </p>
                                        )}

                                        {(log.changes || log.metadata) && (
                                            <div className="mt-3 bg-slate-100 dark:bg-slate-950/50 rounded-lg p-3 overflow-auto max-h-48 border border-slate-200 dark:border-slate-800/80 scrollbar-thin">
                                                <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                                                    {JSON.stringify(log.changes || log.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                                            {log.ipAddress && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{log.ipAddress}</span>
                                                </div>
                                            )}
                                            {log.userAgent && (
                                                <div className="flex items-center gap-1 truncate max-w-[200px]" title={log.userAgent}>
                                                    <MonitorSmartphone className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{log.userAgent}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

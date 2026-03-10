"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Bell, X, Trash2, Archive, ArchiveRestore,
    CheckCheck, Info, AlertTriangle, XOctagon,
    CheckCircle2, Inbox, Sparkles, ArchiveIcon,
    BellOff
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";

import {
    useNotifications,
    useUnreadCount,
    useNotificationActions,
    Notification,
    NotificationTab,
    NotificationType,
} from "@hooks/features/notifications/use-notifications";
import { cn } from "../../utils/utils";

interface NotificationPanelProps {
    onSelectLink?: (link: string) => void;
}

const TAB_CONFIG: { key: NotificationTab; label: string; icon: React.ElementType }[] = [
    { key: "principal", label: "Principal", icon: Inbox },
    { key: "novedades", label: "Novedades", icon: Sparkles },
    { key: "archivo", label: "Archivo", icon: ArchiveIcon },
];

function getIcon(type: NotificationType) {
    switch (type) {
        case "SUCCESS": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        case "WARNING":
        case "BILL_OVERDUE": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        case "ERROR":
        case "DIAN_REJECTED": return <XOctagon className="w-4 h-4 text-rose-500" />;
        default: return <Info className="w-4 h-4 text-blue-500" />;
    }
}

function groupByDate(notifs: Notification[]) {
    const groups: { label: string; items: Notification[] }[] = [];
    const map = new Map<string, Notification[]>();

    notifs.forEach((n) => {
        const d = new Date(n.createdAt);
        const key = isToday(d) ? "Hoy" : isYesterday(d) ? "Ayer" : format(d, "d 'de' MMMM", { locale: es });
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(n);
    });

    map.forEach((items, label) => groups.push({ label, items }));
    return groups;
}

export function NotificationDropdown({ onSelectLink }: NotificationPanelProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<NotificationTab>("principal");
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const unreadCount = useUnreadCount();
    const { data, refetch } = useNotifications(activeTab);
    const { markRead, archive, remove } = useNotificationActions();

    const notifications = data?.notifications ?? [];
    const counts = data?.counts;

    // Ringing animation
    const prevUnread = useRef(unreadCount);
    const [ringing, setRinging] = useState(false);
    useEffect(() => {
        if (unreadCount > prevUnread.current) {
            setRinging(true);
            const t = setTimeout(() => setRinging(false), 1500);
            return () => clearTimeout(t);
        }
        prevUnread.current = unreadCount;
    }, [unreadCount]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const toggleOpen = () => {
        if (!open) refetch();
        setOpen((v) => !v);
    };

    const handleTabChange = (tab: NotificationTab) => {
        setActiveTab(tab);
    };

    const grouped = groupByDate(notifications);

    return (
        <>
            <style>{`
                @keyframes bell-ring {
                    0%   { transform: rotate(0deg); }
                    10%  { transform: rotate(15deg); }
                    20%  { transform: rotate(-12deg); }
                    30%  { transform: rotate(10deg); }
                    40%  { transform: rotate(-8deg); }
                    50%  { transform: rotate(6deg); }
                    60%  { transform: rotate(-4deg); }
                    70%  { transform: rotate(3deg); }
                    80%  { transform: rotate(-2deg); }
                    100% { transform: rotate(0deg); }
                }
                .bell-ring { animation: bell-ring 0.9s ease-in-out; transform-origin: top center; }
                @keyframes badge-pop {
                    0%   { transform: scale(0); opacity: 0; }
                    70%  { transform: scale(1.3); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .badge-pop { animation: badge-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
            `}</style>

            <div className="relative" ref={panelRef}>
                {/* Bell trigger */}
                <button
                    onClick={toggleOpen}
                    className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm group"
                    aria-label="Notificaciones"
                >
                    <Bell className={cn(
                        "w-4.5 h-4.5 transition-all duration-300",
                        unreadCount > 0 ? "text-amber-500" : "text-slate-400 group-hover:text-purple-600",
                        ringing ? "bell-ring" : "",
                    )} />
                    {unreadCount > 0 && (
                        <span key={unreadCount} className="badge-pop absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-rose-500 rounded-lg border-2 border-white dark:border-slate-900 text-[10px] font-black text-white shadow-lg shadow-rose-500/20">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                {/* Panel */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                            className="absolute right-0 top-12 w-[420px] max-h-[85vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/60 flex flex-col overflow-hidden z-[100]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-slate-900">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Notificaciones</h2>
                                    {(counts?.unread ?? 0) > 0 && (
                                        <p className="text-xs font-bold text-blue-500 mt-0.5 uppercase tracking-wider">
                                            {counts!.unread} por leer
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {(counts?.unread ?? 0) > 0 && (
                                        <button
                                            onClick={() => markRead.mutate({ markAllRead: true })}
                                            title="Marcar todas como leídas"
                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                        >
                                            <CheckCheck className="w-4.5 h-4.5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                    >
                                        <X className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex px-4 pt-2 border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/30">
                                {TAB_CONFIG.map((tab) => {
                                    const isActive = activeTab === tab.key;
                                    const badge = tab.key === "novedades"
                                        ? counts?.unread
                                        : tab.key === "archivo"
                                            ? counts?.archived
                                            : undefined;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => handleTabChange(tab.key)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative",
                                                isActive
                                                    ? "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-blue-600 after:rounded-full"
                                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            )}
                                        >
                                            <tab.icon className="w-3.5 h-3.5" />
                                            {tab.label}
                                            {(badge ?? 0) > 0 && (
                                                <span className={cn(
                                                    "text-[9px] font-black px-1.5 py-0.5 rounded-md", 
                                                    isActive ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                )}>
                                                    {badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Notification list */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-10 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="w-16 h-16 rounded-[24px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 shadow-inner">
                                            <BellOff className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {activeTab === "archivo" ? "Archivo vacío" : "Todo al día"}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                            {activeTab === "archivo" ? "Las notificaciones que archives aparecerán aquí para tu registro." : "No tienes notificaciones pendientes por revisar."}
                                        </p>
                                    </div>
                                ) : (
                                    grouped.map(({ label, items }) => (
                                        <div key={label}>
                                            {/* Date separator */}
                                            <div className="px-6 py-2.5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
                                            </div>

                                            {items.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onMouseEnter={() => setHoveredId(notif.id)}
                                                    onMouseLeave={() => setHoveredId(null)}
                                                    className={cn(
                                                        "group relative flex items-start gap-4 px-6 py-5 border-b border-slate-50 dark:border-slate-900 last:border-0 cursor-pointer transition-all",
                                                        notif.read
                                                            ? "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                                            : "bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50"
                                                    )}
                                                    onClick={() => {
                                                        if (!notif.read) markRead.mutate({ notificationId: notif.id });
                                                        if (notif.link && onSelectLink) {
                                                            onSelectLink(notif.link);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                >
                                                    {/* Type icon */}
                                                    <div className={cn(
                                                        "mt-0.5 shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110",
                                                        notif.type === "SUCCESS" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800" :
                                                        notif.type === "WARNING" || notif.type === "BILL_OVERDUE" ? "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800" :
                                                        notif.type === "ERROR" || notif.type === "DIAN_REJECTED" ? "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800" :
                                                        "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                                                    )}>
                                                        {getIcon(notif.type)}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className={cn(
                                                                "text-sm leading-snug tracking-tight truncate", 
                                                                notif.read ? "text-slate-600 dark:text-slate-400 font-medium" : "text-slate-900 dark:text-white font-black"
                                                            )}>
                                                                {notif.title}
                                                            </p>
                                                            {!notif.read && (
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40 shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions on hover */}
                                                    <div className={cn(
                                                        "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-300",
                                                        hoveredId === notif.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
                                                    )}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {notif.archived ? (
                                                            <button
                                                                onClick={() => archive.mutate({ unarchiveId: notif.id })}
                                                                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-600 hover:border-amber-200 transition-all shadow-xl"
                                                            >
                                                                <ArchiveRestore size={14} className="mx-auto" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => archive.mutate({ archiveId: notif.id })}
                                                                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-600 hover:border-amber-200 transition-all shadow-xl"
                                                            >
                                                                <Archive size={14} className="mx-auto" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => remove.mutate({ notificationId: notif.id })}
                                                            className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-xl"
                                                        >
                                                            <Trash2 size={14} className="mx-auto" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/30 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {notifications.length} documentos
                                    </span>
                                    {activeTab !== "archivo" && (
                                        <button
                                            className="text-xs text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter hover:underline"
                                            onClick={() => handleTabChange("archivo")}
                                        >
                                            Ver archivo histórico →
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

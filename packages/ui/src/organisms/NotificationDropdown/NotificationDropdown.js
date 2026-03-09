"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Bell, X, Trash2, Archive, ArchiveRestore, CheckCheck, Info, AlertTriangle, XOctagon, CheckCircle2, Inbox, Sparkles, ArchiveIcon, BellOff } from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications, useUnreadCount, useNotificationActions, } from "@hooks/features/notifications/use-notifications";
const TAB_CONFIG = [
    { key: "principal", label: "Principal", icon: Inbox },
    { key: "novedades", label: "Novedades", icon: Sparkles },
    { key: "archivo", label: "Archivo", icon: ArchiveIcon },
];
function getIcon(type) {
    switch (type) {
        case "SUCCESS": return _jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" });
        case "WARNING":
        case "BILL_OVERDUE": return _jsx(AlertTriangle, { className: "w-4 h-4 text-amber-500" });
        case "ERROR":
        case "DIAN_REJECTED": return _jsx(XOctagon, { className: "w-4 h-4 text-rose-500" });
        default: return _jsx(Info, { className: "w-4 h-4 text-blue-500" });
    }
}
function groupByDate(notifs) {
    const groups = [];
    const map = new Map();
    notifs.forEach((n) => {
        const d = new Date(n.createdAt);
        const key = isToday(d) ? "Hoy" : isYesterday(d) ? "Ayer" : format(d, "d 'de' MMMM", { locale: es });
        if (!map.has(key))
            map.set(key, []);
        map.get(key).push(n);
    });
    map.forEach((items, label) => groups.push({ label, items }));
    return groups;
}
export function NotificationDropdown({ onSelectLink }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("principal");
    const [hoveredId, setHoveredId] = useState(null);
    const panelRef = useRef(null);
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
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open)
            document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
    const toggleOpen = () => {
        if (!open)
            refetch();
        setOpen((v) => !v);
    };
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    const grouped = groupByDate(notifications);
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
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
            ` }), _jsxs("div", { className: "relative", ref: panelRef, children: [_jsxs("button", { onClick: toggleOpen, className: "relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition", "aria-label": "Notificaciones", children: [_jsx(Bell, { className: [
                                    "w-5 h-5 transition-colors duration-300",
                                    unreadCount > 0 ? "text-amber-500" : "text-muted-foreground",
                                    ringing ? "bell-ring" : "",
                                ].join(" ") }), unreadCount > 0 && (_jsx("span", { className: "badge-pop absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center bg-rose-500 rounded-full border-2 border-white dark:border-background text-[9px] font-bold text-white", children: unreadCount > 9 ? "9+" : unreadCount }, unreadCount))] }), _jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { initial: { opacity: 0, y: -8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.97 }, transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] }, className: "absolute right-0 top-10 w-[480px] max-h-[80vh] bg-white dark:bg-slate-950 border border-sidebar-border rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 flex flex-col overflow-hidden z-50", children: [_jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold text-slate-900 dark:text-white", children: "Notificaciones" }), (counts?.unread ?? 0) > 0 && (_jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [counts.unread, " sin leer"] }))] }), _jsxs("div", { className: "flex items-center gap-1", children: [(counts?.unread ?? 0) > 0 && (_jsx("button", { onClick: () => markRead.mutate({ markAllRead: true }), title: "Marcar todas como le\u00C3\u00ADdas", className: "p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-xs flex items-center gap-1", children: _jsx(CheckCheck, { className: "w-4 h-4" }) })), notifications.length > 0 && activeTab !== "archivo" && (_jsx("button", { onClick: () => archive.mutate({ archiveAll: true }), title: "Archivar todas", className: "p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition", children: _jsx(Archive, { className: "w-4 h-4" }) })), notifications.length > 0 && (_jsx("button", { onClick: () => remove.mutate({ deleteAll: true }), title: "Eliminar todas", className: "p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition", children: _jsx(Trash2, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => setOpen(false), className: "p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "flex gap-0 px-5 border-b border-sidebar-border mb-0", children: TAB_CONFIG.map((tab) => {
                                        const isActive = activeTab === tab.key;
                                        const badge = tab.key === "novedades"
                                            ? counts?.unread
                                            : tab.key === "archivo"
                                                ? counts?.archived
                                                : undefined;
                                        return (_jsxs("button", { onClick: () => handleTabChange(tab.key), className: [
                                                "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors relative -mb-px",
                                                isActive
                                                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            ].join(" "), children: [_jsx(tab.icon, { className: "w-3.5 h-3.5" }), tab.label, (badge ?? 0) > 0 && (_jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`, children: badge }))] }, tab.key));
                                    }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: notifications.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center px-8", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4", children: _jsx(BellOff, { className: "w-7 h-7 text-slate-400" }) }), _jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: activeTab === "archivo" ? "Archivo vacÃ­o" : activeTab === "novedades" ? "Sin novedades" : "Todo al dÃ­a" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: activeTab === "archivo" ? "Las notificaciones archivadas aparecerÃ¡n aquÃ­." : "No tienes notificaciones pendientes." })] })) : (grouped.map(({ label, items }) => (_jsxs("div", { children: [_jsx("div", { className: "px-5 py-2 bg-slate-50/80 dark:bg-slate-900/50 border-b border-sidebar-border/50", children: _jsx("span", { className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wide", children: label }) }), items.map((notif) => (_jsxs("div", { onMouseEnter: () => setHoveredId(notif.id), onMouseLeave: () => setHoveredId(null), className: [
                                                    "group relative flex items-start gap-3 px-5 py-3.5 border-b border-sidebar-border/30 last:border-0 cursor-pointer transition-colors",
                                                    notif.read
                                                        ? "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                                        : "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                ].join(" "), onClick: () => {
                                                    if (!notif.read)
                                                        markRead.mutate({ notificationId: notif.id });
                                                    if (notif.link && onSelectLink) {
                                                        onSelectLink(notif.link);
                                                        setOpen(false);
                                                    }
                                                }, children: [_jsx("div", { className: `mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${notif.type === "SUCCESS" ? "bg-emerald-50 dark:bg-emerald-900/20" :
                                                            notif.type === "WARNING" || notif.type === "BILL_OVERDUE" ? "bg-amber-50 dark:bg-amber-900/20" :
                                                                notif.type === "ERROR" || notif.type === "DIAN_REJECTED" ? "bg-rose-50 dark:bg-rose-900/20" :
                                                                    "bg-blue-50 dark:bg-blue-900/20"}`, children: getIcon(notif.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: `text-sm leading-snug ${notif.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white font-medium"}`, children: notif.title }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed", children: notif.message }), _jsx("p", { className: "text-[10px] text-slate-400 mt-1", children: formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es }) })] }), !notif.read && (_jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" })), _jsxs("div", { className: `absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity ${hoveredId === notif.id ? "opacity-100" : "opacity-0"}`, onClick: (e) => e.stopPropagation(), children: [notif.archived ? (_jsx("button", { onClick: () => archive.mutate({ unarchiveId: notif.id }), title: "Desarchivar", className: "p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sidebar-border text-slate-400 hover:text-amber-500 hover:border-amber-300 transition shadow-sm", children: _jsx(ArchiveRestore, { className: "w-3.5 h-3.5" }) })) : (_jsx("button", { onClick: () => archive.mutate({ archiveId: notif.id }), title: "Archivar", className: "p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sidebar-border text-slate-400 hover:text-amber-500 hover:border-amber-300 transition shadow-sm", children: _jsx(Archive, { className: "w-3.5 h-3.5" }) })), _jsx("button", { onClick: () => remove.mutate({ notificationId: notif.id }), title: "Eliminar", className: "p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sidebar-border text-slate-400 hover:text-rose-500 hover:border-rose-300 transition shadow-sm", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] }, notif.id)))] }, label)))) }), notifications.length > 0 && (_jsxs("div", { className: "px-5 py-3 border-t border-sidebar-border bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center", children: [_jsxs("span", { className: "text-xs text-slate-400", children: [notifications.length, " notificaciones"] }), activeTab !== "archivo" && (_jsx("button", { className: "text-xs text-blue-500 hover:text-blue-600 font-medium transition", onClick: () => handleTabChange("archivo"), children: "Ver archivo \u00E2\u2020\u2019" }))] }))] })) })] })] }));
}

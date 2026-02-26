import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@interfaces/lib/api-client';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DIAN_REJECTED' | 'BILL_OVERDUE';
export type NotificationTab = 'principal' | 'novedades' | 'archivo';

export interface Notification {
    id: string;
    userId: string;
    companyId: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    archived: boolean;
    link?: string | null;
    createdAt: string;
}

export interface NotificationCounts {
    unread: number;
    archived: number;
}

export interface NotificationsResponse {
    notifications: Notification[];
    counts: NotificationCounts;
}

export const notificationKeys = {
    all: ['notifications'] as const,
    byTab: (tab: NotificationTab) => [...notificationKeys.all, tab] as const,
};

export const useNotifications = (tab: NotificationTab = 'principal') => {
    return useQuery({
        queryKey: notificationKeys.byTab(tab),
        queryFn: async () => {
            const response = await apiClient.get<NotificationsResponse>(`/api/notifications?tab=${tab}`);
            return response;
        },
        refetchInterval: 20 * 1000,
        refetchOnWindowFocus: true,
    });
};

/** Hook ligero solo para el badge de la campana (unread count) */
export const useUnreadCount = () => {
    const { data } = useNotifications('principal');
    return data?.counts?.unread ?? 0;
};

export const useNotificationActions = () => {
    const queryClient = useQueryClient();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: notificationKeys.all });

    const markRead = useMutation({
        mutationFn: (params: { notificationId?: string; markAllRead?: boolean }) =>
            apiClient.patch('/api/notifications', params),
        onSuccess: invalidate,
    });

    const archive = useMutation({
        mutationFn: (params: { archiveId?: string; archiveAll?: boolean; unarchiveId?: string }) =>
            apiClient.patch('/api/notifications', params),
        onSuccess: invalidate,
    });

    const remove = useMutation({
        mutationFn: (params: { notificationId?: string; deleteAll?: boolean }) =>
            apiClient.delete('/api/notifications', params),
        onSuccess: invalidate,
    });

    return { markRead, archive, remove };
};

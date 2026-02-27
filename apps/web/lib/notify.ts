import { prisma } from '@interfaces/lib/prisma';

export type NotificationType =
    | 'INFO'
    | 'SUCCESS'
    | 'WARNING'
    | 'ERROR'
    | 'DIAN_REJECTED'
    | 'BILL_OVERDUE';

interface CreateNotificationInput {
    userId: string;
    companyId: string;
    title: string;
    message: string;
    type?: NotificationType;
    /** Optional deep link, e.g. "Sales/Bills" or a full URL */
    link?: string;
}

/**
 * createNotification — helper central de notificaciones.
 * Llámalo de forma no bloqueante con `void createNotification(...)` o
 * awaitable si necesitas garantizar que se guardó antes de responder.
 *
 * @example
 * // En cualquier API route:
 * void createNotification({
 *   userId: payload.id,
 *   companyId: company.id,
 *   title: 'Factura rechazada por DIAN',
 *   message: `La factura ${bill.number} fue rechazada: ${reason}`,
 *   type: 'DIAN_REJECTED',
 *   link: 'Sales/Bills',
 * });
 */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
    try {
        await prisma.notification.create({
            data: {
                userId: input.userId,
                companyId: input.companyId,
                title: input.title,
                message: input.message,
                type: input.type ?? 'INFO',
                link: input.link ?? null,
            },
        });
    } catch (err) {
        // Las notificaciones nunca deben bloquear el flujo principal
        console.error('[NOTIFY] Error creating notification:', err);
    }
}

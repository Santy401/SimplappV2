import { prisma } from './prisma';

export type ActivityLogAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'SEND' 
  | 'CANCEL' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | string;

export interface LogActivityProps {
  companyId: string;
  userId?: string | null;
  action: ActivityLogAction;
  entityType: string;
  entityId: string;
  changes?: any;
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Registra una acción en el Log de Actividad (Activity Log).
 * Se recomienda invocar esta función de forma asíncrona sin un await estricto 
 * en el thread principal si no es indispensable, o dentro de un try/catch para
 * evitar que interrumpa el flujo de negocio.
 */
export async function logActivity({
  companyId,
  userId,
  action,
  entityType,
  entityId,
  changes,
  metadata,
  ipAddress,
  userAgent,
}: LogActivityProps) {
  try {
    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action,
        entityType,
        entityId,
        changes: changes ? (changes as any) : undefined,
        metadata: metadata ? (metadata as any) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('❌ Error registrando log de actividad:', error);
  }
}

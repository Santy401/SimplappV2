import { cookies } from 'next/headers';
import { verifyAccessToken } from './token';
import { prisma } from '../prisma';

export interface AuthContext {
    userId: string;
    companyId: string;
    user: any;
    company: any;
}

/**
 * Obtiene el contexto de autenticación y la empresa activa.
 * La empresa activa es user.lastCompanyId si existe, de lo contrario la primera empresa asociada.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) return null;

        const payload = await verifyAccessToken(accessToken) as { id: string };
        if (!payload || !payload.id) return null;

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { companies: { include: { company: true } } },
        });

        if (!user || user.companies.length === 0) return null;

        const currentCompanyEntry = user.lastCompanyId
            ? user.companies.find((uc: { companyId: string }) => uc.companyId === user.lastCompanyId)
            : user.companies[0];

        const activeCompanyEntry = currentCompanyEntry || user.companies[0];

        return {
            userId: user.id,
            companyId: activeCompanyEntry.company.id,
            user,
            company: activeCompanyEntry.company
        };
    } catch (error) {
        console.error('Error in getAuthContext:', error);
        return null;
    }
}

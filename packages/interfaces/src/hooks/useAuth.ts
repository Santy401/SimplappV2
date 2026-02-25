import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @deprecated Usar `useSession` de `@hooks/features/auth/use-session` como fuente de verdad
 * para el estado de autenticación (isAuthenticated, user, isLoading).
 *
 * `useAuth` se mantiene SOLO para:
 *  - `logout()` — cierra la sesión y limpia cookies
 *  - El timer de auto-refresh del access-token (13 min)
 *
 * No usar para leer datos del usuario ni el estado de autenticación.
 * En su lugar: `const { user, isAuthenticated } = useSession();`
 */
export function useAuth() {
    const router = useRouter();
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Failed to refresh token');
                router.push('/colombia/Login');
                return false;
            }

            const data = await response.json();
            scheduleTokenRefresh();
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            router.push('/colombia/Login');
            return false;
        }
    }, [router]);

    const scheduleTokenRefresh = useCallback(() => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const REFRESH_INTERVAL = 13 * 60 * 1000;

        refreshTimerRef.current = setTimeout(() => {
            refreshAccessToken();
        }, REFRESH_INTERVAL);
    }, [refreshAccessToken]);

    const checkSession = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/session', {
                credentials: 'include',
            });

            if (!response.ok) {
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    router.push('/colombia/Login');
                }
                return;
            }

            scheduleTokenRefresh();
        } catch (error) {
            console.error('Error checking session:', error);
            router.push('/colombia/Login');
        }
    }, [refreshAccessToken, scheduleTokenRefresh, router]);

    const logout = useCallback(async () => {
        try {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }

            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
            const loginUrl = rootDomain
                ? `https://${rootDomain}/colombia/Login/`
                : '/colombia/Login/';
            window.location.href = loginUrl;
        } catch (error) {
            console.error('Logout error:', error);
            const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
            const loginUrl = rootDomain
                ? `https://${rootDomain}/colombia/Login/`
                : '/colombia/Login/';
            window.location.href = loginUrl;
        }
    }, [router]);

    useEffect(() => {
        checkSession();

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, [checkSession]);

    return {
        logout,
        refreshAccessToken,
    };
}

/**
 * Ejemplo de uso:
 * 
 * function ProtectedPage() {
 *   const { logout } = useAuth();
 * 
 *   return (
 *     <div>
 *       <button onClick={logout}>Cerrar Sesión</button>
 *       <p>Contenido protegido</p>
 *     </div>
 *   );
 * }
 */

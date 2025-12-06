import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
                router.push('/login');
                return false;
            }

            const data = await response.json();
            console.log('Token refreshed successfully');

            scheduleTokenRefresh();

            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            router.push('/login');
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

        console.log('Token refresh scheduled for 13 minutes');
    }, [refreshAccessToken]);

    const checkSession = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/session', {
                credentials: 'include',
            });

            if (!response.ok) {
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    router.push('/login');
                }
                return;
            }

            scheduleTokenRefresh();
        } catch (error) {
            console.error('Error checking session:', error);
            router.push('/login');
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

            router.push('/ui/pages/Login');
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/ui/pages/Login');
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

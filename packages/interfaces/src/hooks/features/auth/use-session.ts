'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/api-client';
import { User } from '@domain/entities/User.entity'
import { useEffect } from 'react';

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  checkSession: () => boolean;
  logout: () => void;
}

export const useSession = (): Session => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await apiClient.get<User>('/api/auth/session');
        return response;
      } catch (error: any) {
        // Si es un error de sesión expirada, no retornar null sino lanzar el error
        if (error?.message === 'Session expired') {
          throw error;
        }
        console.error('Session error:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      // No reintentar si es un error de sesión expirada
      if (error?.message === 'Session expired') {
        return false;
      }
      // Solo reintentar una vez para otros errores
      return failureCount < 1;
    },
    retryDelay: 1000,
  });

  const checkSession = () => {
    return !!data;
  };

  const logout = () => {
    // Limpiar el cache de la query
    queryClient.setQueryData(['session'], null);
    queryClient.invalidateQueries({ queryKey: ['session'] });

    // Disparar evento de sesión expirada
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('session:expired'));
    }
  };

  // Escuchar eventos de sesión expirada
  useEffect(() => {
    const handleSessionExpired = () => {
      queryClient.setQueryData(['session'], null);
      queryClient.invalidateQueries({ queryKey: ['session'] });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('session:expired', handleSessionExpired);
      return () => window.removeEventListener('session:expired', handleSessionExpired);
    }
  }, [queryClient]);

  return {
    user: data || null,
    isAuthenticated: !!data,
    isLoading,
    isError,
    error: error as Error | null,
    checkSession,
    logout,
  };
};
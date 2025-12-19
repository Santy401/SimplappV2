'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@interfaces/lib/api-client';
import { User } from '@domain/entities/User.entity'

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useSession = (): Session => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await apiClient.get<User>('/api/auth/session');
        return response;
      } catch (error) {
        console.error('Session error:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    user: data || null,
    isAuthenticated: !!data,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
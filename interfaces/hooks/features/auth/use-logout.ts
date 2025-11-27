'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/interfaces/lib/api-client';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post('/api/auth/logout');
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.clear();
      
      router.push('/login');
    },
    onError: (error: Error) => {
      console.error('Logout error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      router.push('/login');
    },
  });
};
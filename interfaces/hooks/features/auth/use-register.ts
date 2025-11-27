'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/interfaces/lib/api-client';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  companyName?: string;
  acceptTerms: boolean;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  message: string;
}

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: RegisterData): Promise<RegisterResponse> => {
      const response = await apiClient.post<RegisterResponse>('/api/auth/register', userData);
      return response;
    },
    onSuccess: (data) => {

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
      }
      
      router.push('/ui/pages/Admin/Dashboard');
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
    },
  });
};
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/interfaces/lib/api-client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    onboardingCompleted: boolean;
  };
  token: string;
}

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
      return response;
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
      }

      if (data.user.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
    },
  });
};
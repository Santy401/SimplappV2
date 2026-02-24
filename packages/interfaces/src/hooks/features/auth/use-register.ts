'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@interfaces/lib/api-client';

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
      toast.success('Cuenta creada exitosamente');
      // Force reload to update session state correctly and route naturally
      window.location.href = "/ui/pages/Onboarding";
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Error al crear la cuenta');
    },
  });
};
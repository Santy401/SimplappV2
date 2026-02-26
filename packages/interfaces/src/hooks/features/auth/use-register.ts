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
  message: string;
}

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: RegisterData): Promise<RegisterResponse> => {
      const response = await apiClient.post<RegisterResponse>('/api/auth/register/', userData);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Cuenta creada exitosamente. Revisa tu correo.', { duration: 6000 });
      // Redirect to login page
      setTimeout(() => {
        // Detect current language route or default to colombia
        const currentPath = window.location.pathname;
        const country = currentPath.split('/')[1] || 'colombia';
        window.location.href = `/${country}/Login/`;
      }, 2000);
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Error al crear la cuenta');
    },
  });
};
'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@interfaces/lib/api-client';

interface ForgotPasswordData {
  email: string;
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData): Promise<{ message: string }> => {
      const response = await apiClient.post<{ message: string }>('/api/auth/forgot-password', data);
      return response;
    },
    onSuccess: (data) => {
      console.log('Password reset email sent:', data.message);
    },
    onError: (error: Error) => {
      console.error('Forgot password error:', error);
    },
  });
};
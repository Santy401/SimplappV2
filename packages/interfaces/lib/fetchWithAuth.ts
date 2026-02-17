// lib/fetchWithAuth.ts
"use client";

import { apiClient } from './api-client';

interface FetchWithAuthOptions extends RequestInit {
  skipSessionCheck?: boolean;
}

export const fetchWithAuth = async <T>(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url);
    return response;
  } catch (error: any) {
    // Si es error 401, la sesión expiró
    if (error?.response?.status === 401) {
      // Disparar evento personalizado para mostrar modal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('session:expired'));
      }
    }
    throw error;
  }
};
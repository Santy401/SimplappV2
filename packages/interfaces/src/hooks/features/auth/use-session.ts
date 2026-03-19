"use client";

import { useSessionContext } from "../../../contexts/SessionContext";

/**
 * Hook universal para acceder al estado de la sesión actual.
 * Centraliza el acceso al SessionContext para simplificar su uso en componentes.
 */
export const useSession = () => {
  const context = useSessionContext();
  
  return {
    user: context.user,
    isLoading: context.loading,
    error: context.error,
    isRefreshing: context.isRefreshing,
    isAuthenticated: !!context.user,
    refresh: context.refreshSession,
    logout: context.logout
  };
};

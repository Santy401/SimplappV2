// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { useSessionContext } from "../../context/SessionContext";
import { Loading } from "@ui/atoms/SessionLoader/Loading";
import { useLoading } from "../../context/LoadingContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  fallback
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useSession();
  const { handleSessionExpired } = useSessionContext();
  const { setGlobalLoading, isAnyLoading } = useLoading();

  // Sincronizar el estado de carga de sesión con el contexto global
  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  useEffect(() => {
    // Solo verificar si no está cargando y no está autenticado
    if (!isLoading && !isAuthenticated) {
      handleSessionExpired();
    }
  }, [isAuthenticated, isLoading, handleSessionExpired]);

  // Mostrar loading unificado
  return (
    <>
      <Loading isVisible={isAnyLoading} />
      {!isLoading && (
        <>
          {/* Si no está autenticado, no renderizar nada (el modal aparecerá) */}
          {!isAuthenticated ? null : children}
        </>
      )}
    </>
  );
};
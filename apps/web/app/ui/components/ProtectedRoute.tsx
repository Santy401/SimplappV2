// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useSession } from "@hooks/features/auth/use-session";
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
  const { setGlobalLoading, isAnyLoading } = useLoading();
  const wasAuthenticated = useRef(false);

  // Sincronizar el estado de carga de sesión con el contexto global
  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  // Rastrear si el usuario alguna vez estuvo autenticado en esta sesión
  useEffect(() => {
    if (isAuthenticated) {
      wasAuthenticated.current = true;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Solo disparar el evento si el usuario ESTABA autenticado y perdió la sesión
    // Esto evita mostrar el modal al primer acceso sin token (ya redirige a login el servidor)
    if (!isLoading && !isAuthenticated && wasAuthenticated.current) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('session:expired'));
      }
    }
  }, [isAuthenticated, isLoading]);

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
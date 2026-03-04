// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { Loading } from "@ui/atoms/SessionLoader/Loading";
import { useLoading } from "../context/LoadingContext";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  fallback: _fallback
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useSession();
  const { setGlobalLoading, isAnyLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
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
    // Redirección de Onboarding
    if (!isLoading && isAuthenticated && user) {
      // Normalizar el pathname para comparación (con o sin trailing slash)
      const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
      if (user.onboardingCompleted === false && normalizedPath !== '/Onboarding/') {
        router.push('/Onboarding/');
      } else if (user.onboardingCompleted === true && normalizedPath === '/Onboarding/') {
        router.push('/');
      }
    }

    // Solo disparar el evento si el usuario ESTABA autenticado y perdió la sesión
    // Esto evita mostrar el modal al primer acceso sin token (ya redirige a login el servidor)
    if (!isLoading && !isAuthenticated && wasAuthenticated.current) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('session:expired'));
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

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
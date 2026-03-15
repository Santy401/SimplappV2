// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useSession, useLoading } from "@simplapp/interfaces";
import { Loading } from "@ui/atoms/SessionLoader/Loading";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  fallback: _fallback
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();
  const { isLoading: isGlobalLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      // Si no hay sesión y no estamos cargando, mandamos a login
      router.push('/colombia/Login');
    }
  }, [isAuthenticated, isSessionLoading, router, pathname]);

  if (isSessionLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

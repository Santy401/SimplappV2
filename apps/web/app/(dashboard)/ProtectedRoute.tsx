// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "@simplapp/interfaces";
import { Loading } from "@ui/atoms/SessionLoader/Loading";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ children,
  fallback: _fallback
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, isRefreshing } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || isRefreshing) return;

    if (!isAuthenticated) {
      router.push('/colombia/Login');
      return;
    }

    // Usuario autenticado pero sin completar onboarding
    if (
      user?.onboardingCompleted === false &&
      !pathname.startsWith('/Onboarding')
    ) {
      router.push('/Onboarding');
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  // Mientras redirige al onboarding, no renderiza el dashboard
  if (user?.onboardingCompleted === false && !pathname.startsWith('/Onboarding')) {
    return null;
  }

  return <>{children}</>;
};
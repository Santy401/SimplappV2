"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { SessionExpiredModal } from "@ui/molecules/SessionExpiredModal";
import { useRouter } from "next/navigation";

interface SessionContextType {
  handleSessionExpired: () => void;
  checkSession: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [showModal, setShowModal] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  const handleSessionExpired = () => {
    setShowModal(true);
  };

  const handleLogin = () => {
    setShowModal(false);
    router.push('/ui/pages/Login');
  };

  const checkSession = () => {
    if (!isLoading && !isAuthenticated) {
      handleSessionExpired();
      return false;
    }
    return true;
  };

  // Rastrear si el usuario estuvo autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setWasAuthenticated(true);
    }
  }, [isAuthenticated]);

  // Detectar si la sesión se pierde mientras la app está abierta
  useEffect(() => {
    if (!isLoading && !isAuthenticated && wasAuthenticated) {
      // Solo mostrar el modal si el usuario ESTABA autenticado antes
      handleSessionExpired();
    }
  }, [isAuthenticated, isLoading, wasAuthenticated]);

  // Escuchar el evento de sesión expirada del apiClient
  useEffect(() => {
    const handleSessionExpiredEvent = () => {
      console.log('Session expired event received');
      handleSessionExpired();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('session:expired', handleSessionExpiredEvent);
      return () => window.removeEventListener('session:expired', handleSessionExpiredEvent);
    }
  }, []);

  return (
    <SessionContext.Provider value={{ handleSessionExpired, checkSession }}>
      {children}
      <SessionExpiredModal isOpen={showModal} onLogin={handleLogin} />
    </SessionContext.Provider>
  );
};
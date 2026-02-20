"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
  const router = useRouter();

  const handleSessionExpired = () => {
    setShowModal(true);
  };

  const handleLogin = () => {
    setShowModal(false);
    router.push('/ui/pages/Login');
  };

  const checkSession = () => {
    // Exponer por compatibilidad, el modal se activa mediante el evento session:expired
    return !showModal;
  };

  // Escuchar el evento de sesión expirada del apiClient
  // Este es el único canal por el que se muestra el modal de sesión expirada
  useEffect(() => {
    const handleSessionExpiredEvent = () => {
      console.log('Session expired event received');
      setShowModal(true);
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
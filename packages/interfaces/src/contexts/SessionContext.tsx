"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  companyId?: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children, sessionExpiredModal: Modal }: { children: ReactNode, sessionExpiredModal: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<User>('/api/auth/session');
      setUser(data);
      setError(null);
    } catch (err: any) {
      setUser(null);
      if (err?.response?.status !== 401) {
        setError("No se pudo cargar la sesión.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSession = async () => {
    await fetchSession();
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout', {});
      setUser(null);
      router.push('/colombia/Login');
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  useEffect(() => {
    fetchSession();

    const handleSessionExpired = () => {
      setShowModal(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('session:expired', handleSessionExpired);
      return () => window.removeEventListener('session:expired', handleSessionExpired);
    }
  }, [fetchSession]);

  const handleLoginRedirect = () => {
    setShowModal(false);
    router.push('/colombia/Login');
  };

  return (
    <SessionContext.Provider value={{ user, loading, error, refreshSession, logout }}>
      {children}
      {Modal && <Modal isOpen={showModal} onLogin={handleLoginRedirect} />}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within SessionProvider");
  }
  return context;
};

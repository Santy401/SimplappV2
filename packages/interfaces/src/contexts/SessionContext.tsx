"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  companyId?: string;
  onboardingCompleted?: boolean;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

export const SessionProvider = ({
  children,
  sessionExpiredModal: Modal,
}: {
  children: ReactNode;
  sessionExpiredModal: any;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const fetchSession = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setLoading(true);

      const data = await apiClient.get<User>("/api/auth/session");
      setUser(data);
      setError(null);
    } catch (err: any) {
      setUser(null);

      const status = err?.status ?? err?.response?.status;

      if (status === 401) {
        return;
      }

      setError("No se pudo cargar la sesión.");
      console.error("[SessionProvider] fetchSession error:", err);
    } finally {
      if (isRefresh) setIsRefreshing(false);
      else setLoading(false);
    }
  }, []);

  const refreshSession = async () => {
    await fetchSession(true);
  };

  const logout = async () => {
    try {
      setUser(null);
      await apiClient.post("/api/auth/logout", {});
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      router.push("/colombia/Login");
    }
  };

  useEffect(() => {
    fetchSession();

    const handleSessionExpired = () => {
      setShowModal(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("session:expired", handleSessionExpired);
      return () =>
        window.removeEventListener("session:expired", handleSessionExpired);
    }
  }, [fetchSession]);

  const handleLoginRedirect = () => {
    setShowModal(false);
    router.push("/colombia/Login");
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, error, isRefreshing, refreshSession, logout }}
    >
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

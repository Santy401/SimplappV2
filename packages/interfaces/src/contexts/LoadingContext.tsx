"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface LoadingContextType {
  isLoading: boolean;
  activeLoaders: string[];
  startLoading: (id: string) => void;
  stopLoading: (id: string) => void;
  isComponentLoading: (id: string) => boolean;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [activeLoaders, setActiveLoaders] = useState<string[]>([]);

  const startLoading = useCallback((id: string) => {
    setActiveLoaders((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const stopLoading = useCallback((id: string) => {
    setActiveLoaders((prev) => prev.filter((loaderId) => loaderId !== id));
  }, []);

  const isComponentLoading = useCallback((id: string) => {
    return activeLoaders.includes(id);
  }, [activeLoaders]);

  const isLoading = activeLoaders.length > 0;

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        activeLoaders, 
        startLoading, 
        stopLoading, 
        isComponentLoading 
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading debe usarse dentro de un LoadingProvider");
  }
  return context;
};

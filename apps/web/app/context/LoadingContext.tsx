"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";

interface LoadingContextType {
    isGlobalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
    isComponentLoading: boolean;
    setComponentLoading: (loading: boolean) => void;
    isAnyLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
};

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [isComponentLoading, setIsComponentLoading] = useState(false);

    const setGlobalLoading = useCallback((loading: boolean) => {
        setIsGlobalLoading(loading);
    }, []);

    const setComponentLoading = useCallback((loading: boolean) => {
        setIsComponentLoading(loading);
    }, []);

    // Si cualquiera está cargando, mostrar loading
    const isAnyLoading = isGlobalLoading || isComponentLoading;

    return (
        <LoadingContext.Provider
            value={{
                isGlobalLoading,
                setGlobalLoading,
                isComponentLoading,
                setComponentLoading,
                isAnyLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

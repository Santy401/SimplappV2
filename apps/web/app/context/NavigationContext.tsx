"use client";

import { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePersistedState } from "@hooks/usePersistedState";

interface NavigationContextType {
    currentView: string;
    navigateTo: (view: string, preserveState?: boolean) => void;
    goBack: () => void;
    navigationHistory: string[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation must be used within NavigationProvider");
    }
    return context;
};

interface NavigationProviderProps {
    children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Persistir el estado de navegación
    const [currentView, setCurrentView] = usePersistedState<string>(
        "app_current_view",
        "dashboard"
    );

    const [navigationHistory, setNavigationHistory] = usePersistedState<string[]>(
        "app_navigation_history",
        []
    );

    // Resetear a "inicio" al montar (cada inicio de sesión)
    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            const viewFromUrl = searchParams.get("view");
            // Siempre arrancar en "inicio" a menos que la URL ya tenga una vista específica
            setCurrentView(viewFromUrl || "inicio");
        }
    }, []);

    // Sincronizar la URL con el estado actual al cambiar searchParams
    useEffect(() => {
        if (isFirstMount.current) return;
        const viewFromUrl = searchParams.get("view");
        if (viewFromUrl && viewFromUrl !== currentView) {
            setCurrentView(viewFromUrl);
        }
    }, [searchParams]);

    // Actualizar la URL cuando cambia la vista
    const navigateTo = (view: string, preserveState: boolean = true) => {
        setCurrentView(view);

        // Agregar a historial
        if (preserveState) {
            setNavigationHistory((prev) => [...prev, currentView]);
        }

        // Actualizar la URL
        const url = new URL(window.location.href);
        url.searchParams.set("view", view);
        router.push(url.pathname + url.search, { scroll: false });
    };

    const goBack = () => {
        if (navigationHistory.length > 0) {
            const previousView = navigationHistory[navigationHistory.length - 1];
            setNavigationHistory((prev) => prev.slice(0, -1));
            navigateTo(previousView, false);
        } else {
            navigateTo("dashboard", false);
        }
    };

    return (
        <NavigationContext.Provider
            value={{
                currentView,
                navigateTo,
                goBack,
                navigationHistory,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

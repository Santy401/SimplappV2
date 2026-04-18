"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
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
        "inicio"
    );

    const [navigationHistory, setNavigationHistory] = usePersistedState<string[]>(
        "app_navigation_history",
        []
    );

    // Sincronizar la URL con el estado actual
    useEffect(() => {
        // Quitar trailing slash y barra inicial: '/ventas/facturacion/' → 'ventas/facturacion'
        const cleanPath = pathname.replace(/\/$/, '');
        const pathSegment = cleanPath.slice(1);

        // La raíz '/' o '/dashboard' equivalen a la vista 'inicio'
        if (pathname === '/' || pathname === '' || pathname === '/dashboard') {
            setCurrentView('inicio');
            return;
        }

        // Si el path difiere del estado actual, sincronizar. 
        // pathSegment es "ventas/facturacion" -> transformamos a "ventas-facturacion"
        const parsedView = pathSegment.replace(/\//g, '-');
        if (parsedView && parsedView !== currentView && parsedView !== 'Onboarding') {
            setCurrentView(parsedView);
        }
    }, [pathname]);

    const navigateTo = (view: string, preserveState: boolean = true) => {
        // Separar path de query params: "ventas/facturacion/view?id=123" -> ["ventas/facturacion/view", "id=123"]
        const [pathPart, queryPart] = view.split('?');
        const cleanPathPart = pathPart.replace(/^\//, '');
        
        setCurrentView(cleanPathPart);

        // Agregar a historial
        if (preserveState) {
            setNavigationHistory((prev) => [...prev, currentView]);
        }

        // Actualizar la URL: inicio/dashboard viven en '/', el resto reemplaza guiones por barras
        let path = (cleanPathPart === 'inicio' || cleanPathPart === 'dashboard' || cleanPathPart === 'i') 
            ? '/' 
            : `/${cleanPathPart.replace(/-/g, '/')}`;
        
        // Agregar query params si existen
        if (queryPart) {
            path += `?${queryPart}`;
        }
        
        router.push(path, { scroll: false });
    };

    const goBack = () => {
        if (navigationHistory.length > 0) {
            const previousView = navigationHistory[navigationHistory.length - 1];
            setNavigationHistory((prev) => prev.slice(0, -1));
            navigateTo(previousView, false);
        } else {
            navigateTo('inicio', false);
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

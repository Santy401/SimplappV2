"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SettingsView = 'perfil' | 'empresa' | 'bancos' | 'suscripcion' | 'facturacion' | 'actividad' | 'seguridad' | 'notificaciones';

interface SettingsContextProps {
    isOpen: boolean;
    isMaximized: boolean;
    currentView: SettingsView;
    openSettings: (view?: SettingsView) => void;
    closeSettings: () => void;
    toggleMaximized: () => void;
    setCurrentView: (view: SettingsView) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [currentView, setCurrentView] = useState<SettingsView>('perfil');

    const openSettings = (view?: SettingsView) => {
        if (view) setCurrentView(view);
        setIsOpen(true);
    };

    const closeSettings = () => {
        setIsOpen(false);
    };

    const toggleMaximized = () => {
        setIsMaximized((prev) => !prev);
    };

    return (
        <SettingsContext.Provider
            value={{
                isOpen,
                isMaximized,
                currentView,
                openSettings,
                closeSettings,
                toggleMaximized,
                setCurrentView,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

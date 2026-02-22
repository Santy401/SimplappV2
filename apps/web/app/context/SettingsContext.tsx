"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
    isOpen: boolean;
    isMaximized: boolean;
    currentView: string;
    setCurrentView: (view: string) => void;
    openSettings: (view?: string) => void;
    closeSettings: () => void;
    toggleMaximized: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [currentView, setCurrentView] = useState('perfil');

    const openSettings = (view: string = 'perfil') => {
        setCurrentView(view);
        setIsOpen(true);
    };

    const closeSettings = () => setIsOpen(false);
    const toggleMaximized = () => setIsMaximized(prev => !prev);

    return (
        <SettingsContext.Provider value={{
            isOpen,
            isMaximized,
            currentView,
            setCurrentView,
            openSettings,
            closeSettings,
            toggleMaximized
        }}>
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

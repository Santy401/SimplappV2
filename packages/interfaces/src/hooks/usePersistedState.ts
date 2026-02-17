import { useEffect, useState } from 'react';

/**
 * Hook para persistir estado en localStorage con sincronización entre tabs
 */
export function usePersistedState<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    // Obtener el valor inicial desde localStorage o usar el valor por defecto
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Guardar en localStorage cuando el estado cambia
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    // Sincronizar entre tabs/ventanas
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setState(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Error parsing storage event for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [state, setState];
}

/**
 * Hook para persistir estado de formularios
 */
export function useFormPersistence<T extends Record<string, any>>(
    formId: string,
    initialValues: T
): {
    values: T;
    updateValue: (field: keyof T, value: any) => void;
    resetForm: () => void;
    clearPersistedData: () => void;
} {
    const [values, setValues] = usePersistedState<T>(
        `form_${formId}`,
        initialValues
    );

    const updateValue = (field: keyof T, value: any) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setValues(initialValues);
    };

    const clearPersistedData = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(`form_${formId}`);
        }
        setValues(initialValues);
    };

    return {
        values,
        updateValue,
        resetForm,
        clearPersistedData,
    };
}

/**
 * Hook para persistir el estado de navegación
 */
export function useNavigationState() {
    const [lastRoute, setLastRoute] = usePersistedState<string>(
        'navigation_last_route',
        '/ui/pages/Admin/Index'
    );

    const [scrollPositions, setScrollPositions] = usePersistedState<Record<string, number>>(
        'navigation_scroll_positions',
        {}
    );

    const saveScrollPosition = (route: string, position: number) => {
        setScrollPositions((prev) => ({
            ...prev,
            [route]: position,
        }));
    };

    const getScrollPosition = (route: string): number => {
        return scrollPositions[route] || 0;
    };

    return {
        lastRoute,
        setLastRoute,
        saveScrollPosition,
        getScrollPosition,
    };
}

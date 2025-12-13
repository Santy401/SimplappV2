import { useEffect, useState } from "react";
import { Store, CreateStoreDto } from "@domain/entities/Store.entity"

export function useStore() {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<String | null>(null)

    useEffect(() => {
        fetchStores();
    }, [])

    const fetchStores = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch('/api/stores');

            if (!response.ok) {
                throw new Error('Error al obtener Bodegas');
            }

            const data = await response.json();
            setStores(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
            console.log('Error fetching Stores:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteStore = async (id: string) => {
        try {
            const response = await fetch(`/api/stores/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar');

            setStores(prev => prev.filter(store => store.id !== id));

            return true;
        } catch (err) {
            console.error('Error deleting store:', err);
            return false;
        }
    };

    const createStore = async (data: CreateStoreDto) => {
        try {
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error al crear');

            const newStore = await response.json();

            setStores(prev => [...prev, newStore]);

            return newStore;
        } catch (err) {
            console.error('Error creating client:', err);
            return null;
        }
    };

    return {
        stores,
        refresh: fetchStores,
        deleteStore,
        createStore,
        error,
        isLoading
    }
}
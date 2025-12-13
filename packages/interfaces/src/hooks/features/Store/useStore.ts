import { useEffect, useState } from "react";
import { Store } from "@domain/entities/Store.entity"

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

    return {
        stores,
        refresh: fetchStores
    }
}
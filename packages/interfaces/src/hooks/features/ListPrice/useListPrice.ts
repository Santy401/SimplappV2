import { useEffect, useState } from "react";
import { ListPrice, CreateListPriceDto, UpdateListPriceDto } from "@domain/entities/ListPrice.entity";
import { set } from "zod";

export function useListPrice() {
    const [listPrices, setListPrices] = useState<ListPrice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingStates, setLoadingStates] = useState({
        fetch: false,
        create: false,
        update: false,
        delete: false,
        get: false,
    });

    const isLoading = {
        fetch: loadingStates.fetch,
        create: loadingStates.create,
        update: loadingStates.update,
        delete: loadingStates.delete,
        get: loadingStates.get,
        any: Object.values(loadingStates).some(Boolean),
    }

    const setLoading = (key: keyof typeof loadingStates, value: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        fetchListPrices();
    }, []);

    const fetchListPrices = async () => {
        try {
            setLoading('fetch', true);
            setError(null);

            const response = await fetch('/api/list-prices');

            if (!response.ok) {
                throw new Error('Error al obtener Listas de Precios');
            }

            const data = await response.json();
            setListPrices(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            console.error('Error fetching List Prices:', err);
        } finally {
            setLoading('fetch', false);
        }
    };

    const deleteListPrice = async (id: string) => {
        setLoading('delete', true);
        try {
            const response = await fetch(`/api/list-prices/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar');

            setListPrices(prev => prev.filter(listPrice => listPrice.id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting list price:', err);
            return false;
        } finally {
            setLoading('delete', false);
        }
    };

    const createListPrice = async (data: CreateListPriceDto) => {
        setLoading('create', true);
        try {
            const response = await fetch('/api/list-prices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error al crear');

            const newListPrice = await response.json();
            setListPrices(prev => [...prev, newListPrice]);
            return newListPrice;
        } catch (err) {
            console.error('Error creating list price:', err);
            return null;
        } finally {
            setLoading('create', false);
        }
    };

    const updateListPrice = async (id: string, data: UpdateListPriceDto) => {
        setLoading('update', true);
        try {
            const response = await fetch(`/api/list-prices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error al actualizar');

            const updatedListPrice = await response.json();
            setListPrices(prev => prev.map(listPrice => 
                listPrice.id === id ? updatedListPrice : listPrice
            ));
            return updatedListPrice;
        } catch (err) {
            console.error('Error updating list price:', err);
            return null;
        } finally {
            setLoading('update', false);
        }
    };

    return {
        listPrices,
        refrech: fetchListPrices,
        deleteListPrice,
        createListPrice,
        updateListPrice,
        error,
        isLoading
    };
}
import { useEffect, useState } from "react";
import { ListPrice, CreateListPriceDto, UpdateListPriceDto } from "@domain/entities/ListPrice.entity";

export function useListPrice() {
    const [listPrices, setListPrices] = useState<ListPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchListPrices();
    }, []);

    const fetchListPrices = async () => {
        try {
            setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    const deleteListPrice = async (id: number) => {
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
        }
    };

    const createListPrice = async (data: CreateListPriceDto) => {
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
        }
    };

    const updateListPrice = async (id: number, data: UpdateListPriceDto) => {
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
        }
    };

    return {
        listPrices,
        refresh: fetchListPrices,
        deleteListPrice,
        createListPrice,
        updateListPrice,
        error,
        isLoading
    };
}
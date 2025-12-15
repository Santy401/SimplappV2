import { CreateSellerDto, Seller, UpdateSellerDto } from "@domain/entities/Seller.entity"
import { useEffect, useState } from "react"

export function useSeller() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<String | null>(null)

    useEffect(() => {
        fetchSellers();
    }, []);


    const fetchSellers = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const respose = await fetch('/api/sellers', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!respose.ok) {
                throw new Error('Error al obtener Vendedores');
            }

            const data = await respose.json()
            setSellers(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
            console.log('Error fetching Sellers:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteSeller = async (id: number) => {
        try {
            const response = await fetch(`/api/sellers/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Error al eliminar');

            setSellers(prev => prev.filter(seller => seller.id !== id));

            return true
        } catch (err) {
            console.error('Error deleting seller:', err);
            return false;
        }
    }

    const createSeller = async (data: CreateSellerDto) => {
        try {
            const response = await fetch(`/api/sellers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error al crear');

            const newSeller = await response.json();

            setSellers(prev => [...prev, newSeller]);

            return newSeller;
        } catch (err) {
            console.error('Error creating seller', err);
            return null;
        }
    }

    const updateSeller = async (id: number, data: UpdateSellerDto) => {
        try {
            const response = await fetch(`/api/sellers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error al actualizar');

            const updatedSeller = await response.json();

            setSellers(prev => prev.map(store =>
                store.id === id ? updatedSeller : store
            ));

            return updatedSeller;
        } catch (err) {
            console.error('Error updating store:', err);
            return null;
        }
    }

    return {
        sellers,
        isLoading,
        error,
        fetchSellers,
        createSeller,
        deleteSeller,
        updateSeller,
    }
}
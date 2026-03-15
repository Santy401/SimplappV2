"use client";
import { useMemo } from "react";
import { toast } from "sonner";
import { Store, CreateStoreDto, UpdateStoreDto } from "@domain/entities/Store.entity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORES_QUERY_KEY = ['stores'];

export function useStore() {
    const queryClient = useQueryClient();

    const { 
        data: storesData = [], 
        isLoading: isFetchingInitial, 
        error: queryError,
        refetch 
    } = useQuery({
        queryKey: STORES_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/stores');
            if (!response.ok) {
                throw new Error('Error al obtener Bodegas');
            }
            const result = await response.json();
            return Array.isArray(result) ? result : (result.data || []);
        },
        staleTime: 5 * 60 * 1000,
    });

    const stores = useMemo(() => storesData as Store[], [storesData]);

    const createMutation = useMutation({
        mutationFn: async (data: CreateStoreDto) => {
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Error al crear bodega');
            }
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY }),
        onError: (err: any) => {
            toast.error(err?.message || 'Error desconocido');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateStoreDto }) => {
            const response = await fetch(`/api/stores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Error al actualizar');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/stores/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar');
            return true;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY }),
    });

    const isLoading = useMemo(() => ({
        fetch: isFetchingInitial,
        create: createMutation.isPending,
        update: updateMutation.isPending,
        delete: deleteMutation.isPending,
        get: false,
        any: isFetchingInitial || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    }), [isFetchingInitial, createMutation.isPending, updateMutation.isPending, deleteMutation.isPending]);

    const error = queryError ? (queryError as Error).message : null;

    return {
        stores,
        refetch,
        refrech: refetch, // Mantener compatibilidad por typo anterior
        deleteStore: (id: string) => deleteMutation.mutateAsync(id),
        createStore: (data: CreateStoreDto) => createMutation.mutateAsync(data),
        updateStore: (id: string, data: UpdateStoreDto) => updateMutation.mutateAsync({ id, data }),
        error,
        isLoading
    }
}

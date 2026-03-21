"use client";
import { useMemo } from "react";
import { ListPrice, CreateListPriceDto, UpdateListPriceDto } from "@domain/entities/ListPrice.entity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LIST_PRICES_QUERY_KEY = ['list-prices'];

export function useListPrice() {
    const queryClient = useQueryClient();

    const { 
        data: listPricesData = [], 
        isLoading: isFetchingInitial, 
        error: queryError,
        refetch 
    } = useQuery({
        queryKey: LIST_PRICES_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/list-prices');
            if (!response.ok) {
                throw new Error('Error al obtener Listas de Precios');
            }
            const result = await response.json();
            return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
        },
        staleTime: 5 * 60 * 1000,
    });

    const listPrices = useMemo(() => listPricesData as ListPrice[], [listPricesData]);

    const createMutation = useMutation({
        mutationFn: async (data: CreateListPriceDto) => {
            const response = await fetch('/api/list-prices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Error al crear');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: LIST_PRICES_QUERY_KEY }),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateListPriceDto }) => {
            const response = await fetch(`/api/list-prices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Error al actualizar');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: LIST_PRICES_QUERY_KEY }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/list-prices/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar');
            return true;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: LIST_PRICES_QUERY_KEY }),
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
        listPrices,
        refetch,
        refrech: refetch, // Compatibilidad
        deleteListPrice: (id: string) => deleteMutation.mutateAsync(id),
        createListPrice: (data: CreateListPriceDto) => createMutation.mutateAsync(data),
        updateListPrice: (id: string, data: UpdateListPriceDto) => updateMutation.mutateAsync({ id, data }),
        error,
        isLoading
    };
}

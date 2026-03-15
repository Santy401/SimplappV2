"use client";
import { CreateSellerDto, Seller, UpdateSellerDto } from "@domain/entities/Seller.entity";
import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const SELLERS_QUERY_KEY = ['sellers'];

export function useSeller() {
  const queryClient = useQueryClient();

  const { 
    data: sellersData = [], 
    isLoading: isFetchingInitial, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: SELLERS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch('/api/sellers', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error al obtener Vendedores');
      }
      const result = await response.json();
      return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
    },
    staleTime: 5 * 60 * 1000,
  });

  const sellers = useMemo(() => sellersData as Seller[], [sellersData]);

  const createMutation = useMutation({
    mutationFn: async (data: CreateSellerDto) => {
      const response = await fetch(`/api/sellers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SELLERS_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdateSellerDto }) => {
      const response = await fetch(`/api/sellers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SELLERS_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/sellers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar');
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SELLERS_QUERY_KEY }),
  });

  const isLoading = useMemo(() => ({
    fetch: isFetchingInitial,
    create: createMutation.isPending,
    update: updateMutation.isPending,
    delete: deleteMutation.isPending,
    deleteId: deleteMutation.isPending,
    export: false,
    view: false,
    rowId: null,
  }), [isFetchingInitial, createMutation.isPending, updateMutation.isPending, deleteMutation.isPending]);

  const error = queryError ? (queryError as Error).message : null;

  return {
    sellers,
    isLoading,
    error,
    refetch,
    createSeller: (data: CreateSellerDto) => createMutation.mutateAsync(data),
    updateSeller: (id: string, data: UpdateSellerDto) => updateMutation.mutateAsync({ id, data }),
    deleteSeller: (id: string) => deleteMutation.mutateAsync(id),
  };
}

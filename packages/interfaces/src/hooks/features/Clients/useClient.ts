"use client";
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client, CreateClientDto } from '@domain/entities/Client.entity';

const CLIENTS_QUERY_KEY = ['clients'];

export function useClients() {
  const queryClient = useQueryClient();

  // Fetching clients with React Query
  const { 
    data: clientsData = [], 
    isLoading: isFetchingInitial, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }
      const result = await response.json();
      return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const clients = useMemo(() => clientsData as Client[], [clientsData]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: CreateClientDto) => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = 'Error al crear cliente';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Ignorar si no hay JSON
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Client> }) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar cliente');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  const isLoading = useMemo(() => ({
    fetch: isFetchingInitial,
    create: createMutation.isPending,
    update: updateMutation.isPending,
    delete: deleteMutation.isPending,
    export: false,
    view: false,
    rowId: null,
  }), [isFetchingInitial, createMutation.isPending, updateMutation.isPending, deleteMutation.isPending]);

  const error = queryError ? (queryError as Error).message : null;

  return {
    clients,
    isLoading,
    error,
    isDeleting: deleteMutation.isPending ? 'deleting' : null,
    isUpdating: updateMutation.isPending ? 'updating' : null,
    isCreating: createMutation.isPending,
    refetch,
    updateClient: async (id: string, data: Partial<Client>) => {
      try {
        await updateMutation.mutateAsync({ id, data });
        return true;
      } catch (err) {
        console.error('Error updating client:', err);
        return false;
      }
    },
    deleteClient: async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        return true;
      } catch (err) {
        console.error('Error deleting client:', err);
        return false;
      }
    },
    createClient: async (data: CreateClientDto) => {
      try {
        return await createMutation.mutateAsync(data);
      } catch (err) {
        console.error('Error creating client:', err);
        return null;
      }
    },
    setError: () => {}, // Maintain compatibility
  };
}

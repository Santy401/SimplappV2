import { useState, useEffect, useCallback, useMemo } from 'react';
import { Client, CreateClientDto } from '@domain/entities/Client.entity';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [LoadingState, setLoadingState] = useState({
    fetch: true,
    create: false,
    update: false,
    delete: false,
    export: false,
    view: false,
    rowId: null,
  });

  const isLoading = useMemo(() => ({
    fetch: LoadingState.fetch,
    create: LoadingState.create,
    update: LoadingState.update,
    delete: LoadingState.delete,
    export: LoadingState.export,
    view: LoadingState.view,
    rowId: LoadingState.rowId,
  }), [LoadingState]);

  const setLoading = useCallback((key: keyof typeof LoadingState, value: boolean) => {
    setLoadingState(prev => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      setLoading('fetch', true);
      setError(null);

      const response = await fetch('/api/clients');

      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading('fetch', false);
    }
  }, [setLoading]);

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
    try {
      setLoading('update', true);
      console.log('Actualizando cliente:', { id, data });

      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Respuesta status:', response.status);

      const responseText = await response.text();
      console.log('Respuesta texto:', responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }

      const updatedClient = JSON.parse(responseText);

      setClients(prev => prev.map(client =>
        client.id === id ? { ...client, ...data } : client
      ));

      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      return false;
    } finally {
      setLoading('update', false);
    }
  }, [setLoading]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      setLoading('delete', true);
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar cliente');
      }

      setClients(prev => prev.filter(client => client.id !== id));

      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente');
      return false;
    } finally {
      setLoading('delete', false);
    }
  }, [setLoading]);

  const createClient = useCallback(async (data: CreateClientDto) => {
    try {
      setLoading('create', true);
      setError(null);

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear cliente');
      }

      const newClient = await response.json();

      setClients(prev => [...prev, newClient]);

      return newClient;
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err instanceof Error ? err.message : 'Error al crear cliente');
      return null;
    } finally {
      setLoading('create', false);
    }
  }, [setLoading]);

  return {
    clients,
    isLoading,
    error,
    isDeleting,
    isUpdating,
    isCreating,
    refetch: fetchClients,
    updateClient,
    deleteClient,
    createClient,
    setError,
  };
}
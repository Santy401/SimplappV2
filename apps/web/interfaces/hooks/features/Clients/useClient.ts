import { useState, useEffect } from 'react';
import { Client, CreateClientDto } from '@/domain/entities/Client.entity';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const updateClient = async (id: number, data: Partial<Client>) => {
    try {
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
    }
  };

  const deleteClient = async (id: number) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setClients(prev => prev.filter(client => client.id !== id));

      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      return false;
    }
  };

  const createClient = async (data: CreateClientDto) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al crear');

      const newClient = await response.json();

      setClients(prev => [...prev, newClient]);

      return newClient;
    } catch (err) {
      console.error('Error creating client:', err);
      return null;
    }
  };

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    updateClient,
    deleteClient,
    createClient,
  };
}
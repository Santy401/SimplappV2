"use client";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@domain/entities/Product.entity";
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PRODUCTS_QUERY_KEY = ['products'];

export function useProduct() {
  const queryClient = useQueryClient();

  // Fetching products with React Query (Caché de 5 minutos)
  const { 
    data: productsData = [], 
    isLoading: isFetchingInitial, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Error al obtener Productos");
      }
      const result = await response.json();
      return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = useMemo(() => productsData as Product[], [productsData]);

  // Mutations (Invalidan el caché para que la tabla se actualice sola)
  const createMutation = useMutation({
    mutationFn: async (data: CreateProductDto) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear producto");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdateProductDto }) => {
      const formattedData = {
        ...data,
        category: data.category ? String(data.category) : data.category,
        costForUnit: data.costForUnit ? Number(data.costForUnit) : null,
        valuePrice: data.valuePrice ? Number(data.valuePrice) : 0,
        taxRate: data.taxRate != null && data.taxRate !== '' ? Number(data.taxRate) : null,
        basePrice: data.basePrice ? Number(data.basePrice) : 0,
      };

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error al actualizar');
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });

  const isLoading = useMemo(() => ({
    fetch: isFetchingInitial,
    create: createMutation.isPending,
    update: updateMutation.isPending,
    delete: deleteMutation.isPending,
  }), [isFetchingInitial, createMutation.isPending, updateMutation.isPending, deleteMutation.isPending]);

  const error = queryError ? (queryError as Error).message : null;

  return {
    products,
    refetch,
    deleteProduct: (id: string) => deleteMutation.mutateAsync(id),
    createProduct: (data: CreateProductDto) => createMutation.mutateAsync(data),
    updateProduct: (id: string, data: UpdateProductDto) => updateMutation.mutateAsync({ id, data }),
    error,
    isLoading,
  };
}

"use client";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@domain/entities/Product.entity";
import { useEffect, useState, useCallback, useMemo } from "react";

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false,
  });

  const isLoading = useMemo(() => ({
    fetch: loadingStates.fetch,
    create: loadingStates.create,
    update: loadingStates.update,
    delete: loadingStates.delete,
  }), [loadingStates]);

  const setIsLoading = useCallback((state: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [state]: value,
    }));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading('fetch', true);
      setError(null);

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Error al obtener Productos");
      }

      const data = await response.json();
      setProducts(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading('fetch', false);
    }
  }, [setIsLoading]);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading('delete', true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");

      setProducts((prev) => prev.filter((products) => products.id !== id));

      return true;
    } catch (err) {
      console.error("Error deleting produts:", err);
    } finally {
      setIsLoading('delete', false);
    }
  }, [setIsLoading]);

  const createProduct = useCallback(async (data: CreateProductDto) => {
    setIsLoading('create', true)
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("❌ Error API:", response.status, responseData);
        throw new Error(responseData.error || "Error al crear producto");
      }

      console.log("✅ Producto creado:", responseData);

      setProducts((prev) => [...prev, responseData]);

      return responseData;
    } catch (err) {
      console.error("💥 Error creating product:", err);
      throw err;
    } finally {
      setIsLoading('create', false)
    }
  }, [setIsLoading]);

  const updateProduct = useCallback(async (id: string, data: UpdateProductDto) => {
    setIsLoading('update', true)
    try {
      // Asegurar que category sea string si es un número
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

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ Error API:', response.status, responseData);
        console.error('📦 Datos enviados:', formattedData);
        throw new Error(responseData.error || responseData.message || 'Error al actualizar');
      }

      console.log('✅ Producto actualizado:', responseData);

      setProducts(prev => prev.map(product =>
        product.id === id ? responseData : product
      ));

      return responseData;
    } catch (err) {
      console.error('💥 Error updating product:', err);
      throw err;
    } finally {
      setIsLoading('update', false)
    }
  }, [setIsLoading]);

  return {
    products,
    refetch: fetchProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    error,
    isLoading,
  };
}

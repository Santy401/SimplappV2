import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@domain/entities/Product.entity";
import { useEffect, useState } from "react";

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<String | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false,
  });

  const isLoading = {
    fetch: loadingStates.fetch,
    create: loadingStates.create,
    update: loadingStates.update,
    delete: loadingStates.delete,
  }

  const setIsLoading = (state: keyof typeof loadingStates, value: boolean) => {
        setLoadingStates(prev => ({
            ...prev,
            [state]: value,
        }));
    }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading('fetch', true);
      setError(null);

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Error al obtener Productos");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.log("Error fetching Products:", err);
    } finally {
      setIsLoading('fetch', false);
    }
  };

  const deleteProduct = async (id: string) => {
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
  };

  const createProduct = async (data: CreateProductDto) => {
    setIsLoading('create', true)
    try {
      console.log("📤 Enviando producto:", data);

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
  };

  const updateProduct = async (id: string, data: UpdateProductDto) => {
    setIsLoading('update', true)
    try {
      console.log('📤 Actualizando producto:', id, data);

      // Asegurar que category sea string si es un número
      const formattedData = {
        ...data,
        category: data.category ? String(data.category) : data.category,
        costForUnit: data.costForUnit ? Number(data.costForUnit) : null,
        valuePrice: data.valuePrice ? Number(data.valuePrice) : 0,
        taxRate: data.taxRate != null && data.taxRate !== '' ? Number(data.taxRate) : null,
        basePrice: data.basePrice ? Number(data.basePrice) : 0,
      };

      console.log('📦 Datos formateados para API:', formattedData);

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
  };

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
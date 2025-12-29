import { Product, CreateProductDto, UpdateProductDto } from "@domain/entities/Product.entity";
import { useEffect, useState } from "react";

export function useProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch('/api/products')


            if (!response.ok) {
                throw new Error('Error al obtener Productos');
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            console.log('Error fetching Products:', err);
        }
    }

    const deleteProduct = async (id: number) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar');

            setProducts(prev => prev.filter(products => products.id !== id));

            return true;
        } catch (err) {
            console.error('Error deleting produts:', err);
        }
    };

    const createProduct = async (data: CreateProductDto) => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Error al crear');

            const newProduct = await response.json();

            setProducts(prev => [...prev, newProduct]);

            return newProduct;
        } catch (err) {
            console.error('Error creating product:', err);
            return null;
        }
    };

    const updateProduct = async (id: number, data: UpdateProductDto) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error al actualizar');

            const updatedProduct = await response.json();

            setProducts(prev => prev.map(products =>
                products.id === id ? updatedProduct : products
            ));

            return updatedProduct;
        } catch (err) {
            console.error('Error updating products:', err);
            return null;
        }
    };

    return {
        products,
        refresh: fetchProducts,
        deleteProduct,
        createProduct,
        updateProduct,
        error,
        isLoading
    }
}
"use client";
import { useMemo } from "react";
import { CreateBillInput, BillDetail, UpdateBill } from '@domain/entities/Bill.entity';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BILLS_QUERY_KEY = ['bills'];

export const useBill = () => {
    const queryClient = useQueryClient();

    // Fetching bills with React Query
    const {
        data: billsData = [],
        isLoading: isFetchingInitial,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: BILLS_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/bills');
            if (!response.ok) {
                throw new Error('Error al obtener facturas');
            }
            const data = await response.json();
            // El API retorna { data: bills, meta: ... }
            return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        },
        staleTime: 5 * 60 * 1000, // 5 minutos de caché
    });

    const bills = useMemo(() => billsData as BillDetail[], [billsData]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (billData: CreateBillInput) => {
            const response = await fetch('/api/bills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear factura');
            }
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY }),
    });

    const updateMutation = useMutation({
        mutationFn: async (billData: UpdateBill) => {
            const response = await fetch(`/api/bills/${billData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar factura');
            }
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (billId: string) => {
            const response = await fetch(`/api/bills/${billId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar factura');
            }
            return true;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY }),
    });

    const getBill = async (billId: string) => {
        const response = await fetch(`/api/bills/${billId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el detalle de la factura');
        }
        return response.json();
    };

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
        bills,
        isLoading,
        error,
        getBill,
        createBill: (data: CreateBillInput) => createMutation.mutateAsync(data),
        updateBill: (data: UpdateBill) => updateMutation.mutateAsync(data),
        deleteBill: (id: string) => deleteMutation.mutateAsync(id),
        refetch,
    };
};

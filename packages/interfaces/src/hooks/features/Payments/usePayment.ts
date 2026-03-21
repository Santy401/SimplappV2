import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePaymentInput } from "@domain/entities/Bill.entity";

const PAYMENTS_QUERY_KEY = ['payments'];
const BILLS_QUERY_KEY = ['bills'];

export function usePayment() {
    const queryClient = useQueryClient();

    const {
        data: paymentsData = [],
        isLoading: isFetchingInitial,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: PAYMENTS_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/payments');
            if (!response.ok) {
                throw new Error('Error al obtener pagos');
            }
            const result = await response.json();
            return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
        },
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: async (data: CreatePaymentInput | any) => {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el pago');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
        },
    });

    const isLoading = useMemo(() => ({
        fetch: isFetchingInitial,
        create: createMutation.isPending,
        update: false,
        deleteId: null,
        deleteMany: false,
        export: false,
        view: false,
        rowId: null,
        any: isFetchingInitial || createMutation.isPending,
    }), [isFetchingInitial, createMutation.isPending]);

    const error = queryError ? (queryError as Error).message : null;

    return {
        payments: paymentsData,
        isLoading,
        error,
        refetch,
        createPayment: (data: CreatePaymentInput | any) => createMutation.mutateAsync(data),
    };
}

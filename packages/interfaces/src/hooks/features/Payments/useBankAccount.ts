"use client";
import { useQuery } from "@tanstack/react-query";

const BANK_ACCOUNTS_QUERY_KEY = ['bank-accounts'];

export function useBankAccount() {
    const {
        data: bankAccountsData = [],
        isLoading: isFetchingInitial,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: BANK_ACCOUNTS_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/bank-accounts');
            if (!response.ok) {
                throw new Error('Error al obtener cuentas bancarias');
            }
            const result = await response.json();
            return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
        },
        staleTime: 5 * 60 * 1000,
    });

    const error = queryError ? (queryError as Error).message : null;

    return {
        bankAccounts: bankAccountsData,
        isLoading: isFetchingInitial,
        error,
        refetch,
    };
}

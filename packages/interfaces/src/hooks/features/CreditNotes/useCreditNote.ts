"use client";
import { useMemo } from "react";
import { CreateCreditNoteInput, CreditNoteStatus, CreditNoteType, CreditNoteReason } from '@domain/entities/CreditNote.entity';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CREDIT_NOTES_QUERY_KEY = ['credit-notes'];

export const useCreditNote = () => {
    const queryClient = useQueryClient();

    const {
        data: creditNotesData = [],
        isLoading: isFetchingInitial,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: CREDIT_NOTES_QUERY_KEY,
        queryFn: async () => {
            console.log('[CreditNotes] Fetching /api/credit-notes');
            const response = await fetch('/api/credit-notes');
            console.log('[CreditNotes] Response status:', response.status);
            if (response.status === 401) {
                throw new Error('Sesión expirada. Por favor, recarga la página e inicia sesión.');
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                console.error('[CreditNotes] Error response:', errorData);
                throw new Error(errorData.error || 'Error al obtener notas de crédito');
            }
            const data = await response.json();
            console.log('[CreditNotes] Data received:', data);
            return Array.isArray(data.data) ? data.data : [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const creditNotes = useMemo(() => creditNotesData as any[], [creditNotesData]);

    const createMutation = useMutation({
        mutationFn: async (data: {
            billId: string;
            type: CreditNoteType;
            reason: CreditNoteReason;
            date?: Date;
            notes?: string;
            items: CreateCreditNoteInput['items'];
            status?: CreditNoteStatus;
        }) => {
            const response = await fetch('/api/credit-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear nota de crédito');
            }
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CREDIT_NOTES_QUERY_KEY }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/credit-notes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cancelar nota de crédito');
            }
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CREDIT_NOTES_QUERY_KEY }),
    });

    const getCreditNote = async (id: string) => {
        const response = await fetch(`/api/credit-notes/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el detalle de la nota de crédito');
        }
        return response.json();
    };

    const isLoading = useMemo(() => ({
        fetch: isFetchingInitial,
        create: createMutation.isPending,
        delete: deleteMutation.isPending,
    }), [isFetchingInitial, createMutation.isPending, deleteMutation.isPending]);

    const error = queryError ? (queryError as Error).message : null;

    return {
        creditNotes,
        isLoading,
        error,
        getCreditNote,
        createCreditNote: (data: Parameters<typeof createMutation.mutateAsync>[0]) => createMutation.mutateAsync(data),
        cancelCreditNote: (id: string) => deleteMutation.mutateAsync(id),
        refetch,
    };
};

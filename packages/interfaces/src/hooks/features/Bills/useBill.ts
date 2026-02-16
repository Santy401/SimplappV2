import { useState } from "react";
import { Bill, CreateBillInput, BillDetail, UpdateBill } from '@domain/entities/Bill.entity';
import { apiClient } from '@interfaces/lib/api-client';

export const useBill = () => {
    const [bills, setBills] = useState<BillDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingState, setLoadingState] = useState({
        fetch: false,
        create: false,
        update: false,
        delete: false,
        export: false,
        view: false,
        rowId: null,
    });

    const isLoading = {
        fetch: loadingState.fetch,
        create: loadingState.create,
        update: loadingState.update,
        delete: loadingState.delete,
        export: loadingState.export,
        view: loadingState.view,
        rowId: loadingState.rowId,
    };

    const setLoading = (key: keyof typeof loadingState, value: boolean) => {
        setLoadingState(prev => ({ ...prev, [key]: value }));
    };

    const fetchBills = async () => {
        setLoading('fetch', true);
        try {
            const data = await apiClient.get<BillDetail[]>('/api/bills');
            setBills(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading('fetch', false);
        }
    };

    const createBill = async (billData: CreateBillInput) => {
        setLoading('create', true);
        try {
            const newBill = await apiClient.post<BillDetail>('/api/bills', billData);
            setBills(prev => [...prev, newBill]);
            return newBill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading('create', false);
        }
    };

    const updateBill = async (billData: UpdateBill) => {
        setLoading('update', true);
        try {
            const updatedBill = await apiClient.put<BillDetail>(`/api/bills/${billData.id}`, billData);
            setBills(prev => prev.map(bill =>
                bill.id === updatedBill.id ? updatedBill : bill
            ));
            return updatedBill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading('update', false);
        }
    };

    const deleteBill = async (billId: string) => {
        setLoading('delete', true);
        try {
            await apiClient.delete(`/api/bills/${billId}`);
            setBills(prev => prev.filter(bill => bill.id !== billId));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return false;
        } finally {
            setLoading('delete', false);
        }
    };

    const getBill = async (billId: string) => {
        setLoading('view', true);
        try {
            const bill = await apiClient.get<BillDetail>(`/api/bills/${billId}`);
            return bill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading('view', false);
        }
    };

    return {
        bills,
        isLoading,
        error,
        getBill,
        createBill,
        updateBill,
        deleteBill,
        refetch: fetchBills,
    };
};
import { useState, useCallback } from "react";
import { Bill, CreateBillInput, BillDetail, UpdateBill } from '@domain/entities/Bill.entity';

export const useBill = () => {
    const [bills, setBills] = useState<BillDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
        const fetchOptions = {
            ...options,
            credentials: 'include' as RequestCredentials,
        };

        let response = await fetch(url, fetchOptions);

        if (response.status === 401) {
            try {
                const refreshResponse = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });
                const data = await refreshResponse.json();

                if (refreshResponse.ok) {
                    // Retry original request
                    response = await fetch(url, fetchOptions);
                }
                setBills(data);
            } catch (err) {
                console.error('Error refreshing token:', err);
            }
        }

        return response;
    }, []);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth('/api/bills');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBills(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const createBill = async (billData: CreateBillInput) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth('/api/bills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newBill = await response.json();
            setBills(prev => [...prev, newBill]);
            return newBill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateBill = async (billData: UpdateBill) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/api/bills/${billData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedBill = await response.json();
            setBills(prev => prev.map(bill =>
                bill.id === updatedBill.id ? updatedBill : bill
            ));
            return updatedBill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteBill = async (billId: string) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/api/bills/${billId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setBills(prev => prev.filter(bill => bill.id !== billId));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getBill = async (billId: string) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/api/bills/${billId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const bill = await response.json();
            return bill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        bills,
        loading,
        error,
        getBill,
        createBill,
        updateBill,
        deleteBill,
        refetch: fetchBills,
    };
};
import { useState } from "react";
import { Bill, CreateBillInput } from '@domain/entities/Bill.entity';

export const useBill = () => {
    // Cambiado de Bill | null a Bill[]
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/bills');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBills(data); // Ahora setBills recibe un array
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const createBill = async (billData: CreateBillInput) => {
        setLoading(true);
        try {
            const response = await fetch('/api/bills', {
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
            // Agregar la nueva factura al array existente
            setBills(prev => [...prev, newBill]);
            return newBill;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateBill = async (billData: Bill) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/bills/${billData.id}`, {
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
            // Actualizar la factura en el array
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

    const deleteBill = async (billId: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/bills/${billId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Eliminar la factura del array
            setBills(prev => prev.filter(bill => bill.id !== billId));
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        bills, // Cambiado de 'bill' a 'bills' (array)
        loading,
        error,
        createBill,
        updateBill,
        deleteBill,
        refetch: fetchBills,
    };
};
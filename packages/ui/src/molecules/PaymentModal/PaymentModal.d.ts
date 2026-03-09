export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: {
        id: string;
        clientName?: string | null;
        number: string | number;
        balance: string | number;
    } | null;
    onSubmit: (payment: {
        date: string;
        bankAccount: string;
        value: string | number;
        paymentMethod: string;
        billId: string;
    }) => void;
}
export declare function PaymentModal({ isOpen, onClose, bill, onSubmit }: PaymentModalProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PaymentModal.d.ts.map